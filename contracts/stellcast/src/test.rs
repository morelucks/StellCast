#![cfg(test)]

use crate::{types::*, StellCastContract, StellCastContractClient};
use soroban_sdk::{symbol_short, testutils::Address as _, Address, Env, String};

#[test]
fn test_initialize_and_create_market() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(StellCastContract, ());
    let client = StellCastContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let creator = Address::generate(&env);
    let collateral = Address::generate(&env);

    client.initialize(&admin);
    assert_eq!(client.get_admin(), admin);
    assert_eq!(client.get_market_count(), 0);

    let question = String::from_str(&env, "Will XLM reach $1 in 2026?");
    let category = symbol_short!("CRYPTO");
    let resolution_time = env.ledger().timestamp() + 86400;
    let initial_liquidity = 1000_0000000i128;

    let market_id = client.create_market(
        &creator,
        &question,
        &category,
        &resolution_time,
        &initial_liquidity,
        &collateral,
    );

    assert_eq!(market_id, 1);
    assert_eq!(client.get_market_count(), 1);

    let market = client.get_market(&1);
    assert_eq!(market.id, 1);
    assert_eq!(market.status, MarketStatus::Open);
    assert_eq!(market.yes_shares, initial_liquidity);
    assert_eq!(market.no_shares, initial_liquidity);
}

#[test]
fn test_buy_shares_and_resolve() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(StellCastContract, ());
    let client = StellCastContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let creator = Address::generate(&env);
    let buyer = Address::generate(&env);
    let collateral = Address::generate(&env);

    client.initialize(&admin);

    let question = String::from_str(&env, "Will Stellar Soroban protocol v23 release?");
    let category = symbol_short!("TECH");
    let resolution_time = env.ledger().timestamp() + 3600;
    let initial_liquidity = 5000_0000000i128;

    let market_id = client.create_market(
        &creator,
        &question,
        &category,
        &resolution_time,
        &initial_liquidity,
        &collateral,
    );

    // Buyer purchases YES shares
    let buy_amount = 500_0000000i128;
    let yes_shares_bought = client.buy_shares(&buyer, &market_id, &Outcome::Yes, &buy_amount);

    assert!(yes_shares_bought > 0);

    let position = client.get_position(&market_id, &buyer);
    assert_eq!(position.yes_shares, yes_shares_bought);
    assert_eq!(position.no_shares, 0);

    let market_after = client.get_market(&market_id);
    assert_eq!(market_after.total_liquidity, initial_liquidity + buy_amount);

    // Resolve market
    client.resolve_market(&admin, &market_id, &Outcome::Yes);

    let resolved_market = client.get_market(&market_id);
    assert_eq!(resolved_market.status, MarketStatus::Resolved);
    assert_eq!(resolved_market.winning_outcome, Outcome::Yes);
}
