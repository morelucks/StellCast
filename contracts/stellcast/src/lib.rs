#![no_std]
use soroban_sdk::contractimpl;

pub struct StellCastContract;

#[contractimpl]
impl StellCastContract {
    pub fn hello() -> u32 {
        42
    }
}
