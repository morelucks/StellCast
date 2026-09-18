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
}
