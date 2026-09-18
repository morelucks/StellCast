#![no_std]
pub mod types;

use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, String, Symbol};
use types::*;

#[contract]
pub struct StellCastContract;

#[contractimpl]
impl StellCastContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::MarketCount, &0u64);
    }

    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("not initialized")
    }

    pub fn get_market_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::MarketCount)
            .unwrap_or(0u64)
    }

    pub fn create_market(
        env: Env,
        creator: Address,
        question: String,
        category: Symbol,
        resolution_time: u64,
        initial_liquidity: i128,
        collateral_token: Address,
    ) -> u64 {
        creator.require_auth();

        let current_time = env.ledger().timestamp();
        if resolution_time <= current_time {
            panic!("resolution_time must be in future");
        }
        if initial_liquidity <= 0 {
            panic!("liquidity must be positive");
        }

        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::MarketCount)
            .unwrap_or(0u64);

        count += 1;

        let market = Market {
            id: count,
            creator: creator.clone(),
            question,
            category,
            resolution_time,
            status: MarketStatus::Open,
            winning_outcome: Outcome::None,
            yes_shares: initial_liquidity,
            no_shares: initial_liquidity,
            total_liquidity: initial_liquidity,
            collateral_token,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Market(count), &market);
        env.storage().instance().set(&DataKey::MarketCount, &count);

        env.events().publish(
            (symbol_short!("created"), count),
            (creator, market.total_liquidity),
        );

        count
    }

    pub fn get_market(env: Env, market_id: u64) -> Market {
        env.storage()
            .persistent()
            .get(&DataKey::Market(market_id))
            .expect("market not found")
    }

    pub fn buy_shares(
        env: Env,
        buyer: Address,
        market_id: u64,
        outcome: Outcome,
        amount: i128,
    ) -> i128 {
        buyer.require_auth();

        if amount <= 0 {
            panic!("amount must be positive");
        }

        let mut market: Market = env
            .storage()
            .persistent()
            .get(&DataKey::Market(market_id))
            .expect("market not found");

        if market.status != MarketStatus::Open {
            panic!("market is not open");
        }

        if env.ledger().timestamp() >= market.resolution_time {
            panic!("market resolution time passed");
        }

        let total_pool = market.yes_shares + market.no_shares;

        let shares_bought = match outcome {
            Outcome::Yes => {
                let user_shares = (amount * market.no_shares) / total_pool;
                market.yes_shares += amount;
                user_shares
            }
            Outcome::No => {
                let user_shares = (amount * market.yes_shares) / total_pool;
                market.no_shares += amount;
                user_shares
            }
            _ => panic!("invalid outcome"),
        };

        if shares_bought <= 0 {
            panic!("shares bought must be greater than zero");
        }

        market.total_liquidity += amount;
        env.storage()
            .persistent()
            .set(&DataKey::Market(market_id), &market);

        // Update position
        let pos_key = DataKey::Position((market_id, buyer.clone()));
        let mut position: Position = env.storage().persistent().get(&pos_key).unwrap_or(Position {
            user: buyer.clone(),
            market_id,
            yes_shares: 0,
            no_shares: 0,
        });

        match outcome {
            Outcome::Yes => position.yes_shares += shares_bought,
            Outcome::No => position.no_shares += shares_bought,
            _ => {}
        }

        env.storage().persistent().set(&pos_key, &position);

        env.events().publish(
            (symbol_short!("bought"), market_id, buyer),
            (outcome as u32, shares_bought, amount),
        );

        shares_bought
    }

    pub fn get_position(env: Env, market_id: u64, user: Address) -> Position {
        let pos_key = DataKey::Position((market_id, user.clone()));
        env.storage().persistent().get(&pos_key).unwrap_or(Position {
            user,
            market_id,
            yes_shares: 0,
            no_shares: 0,
        })
    }

    pub fn resolve_market(env: Env, admin: Address, market_id: u64, winning_outcome: Outcome) {
        admin.require_auth();

        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .expect("not initialized");

        if admin != stored_admin {
            panic!("only admin can resolve");
        }

        let mut market: Market = env
            .storage()
            .persistent()
            .get(&DataKey::Market(market_id))
            .expect("market not found");

        if market.status != MarketStatus::Open {
            panic!("market not open");
        }

        market.status = MarketStatus::Resolved;
        market.winning_outcome = winning_outcome;

        env.storage()
            .persistent()
            .set(&DataKey::Market(market_id), &market);

        env.events().publish(
            (symbol_short!("resolved"), market_id),
            winning_outcome as u32,
        );
    }
}
