#![no_std]
pub mod types;

use soroban_sdk::{contract, contractimpl, Env, Address, String, Symbol};
use types::*;

#[contract]
pub struct StellCastContract;

#[contractimpl]
impl StellCastContract {
    pub fn hello(env: Env) -> u32 {
        42
    }
}
