use soroban_sdk::{contracttype, Address, String, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MarketStatus {
    Open,
    Resolved,
    Canceled,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq, Copy)]
pub enum Outcome {
    None,
    Yes,
    No,
    Invalid,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Market {
    pub id: u64,
    pub creator: Address,
    pub question: String,
    pub category: Symbol,
    pub resolution_time: u64,
    pub status: MarketStatus,
    pub winning_outcome: Outcome,
    pub yes_shares: i128,
    pub no_shares: i128,
    pub total_liquidity: i128,
    pub collateral_token: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Position {
    pub user: Address,
    pub market_id: u64,
    pub yes_shares: i128,
    pub no_shares: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Admin,
    MarketCount,
    Market(u64),
    Position((u64, Address)),
}
