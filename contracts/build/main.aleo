program zkpm_contract.aleo;

record Bet:
    owner as address.private;
    outcome as u8.private;
    amount as u64.private;
    price as u64.private;

mapping world_prices:
    key as u8.public;
    value as u64.public;

mapping total_volume:
    key as u8.public;
    value as u64.public;

function initialize:
    async initialize into r0;
    output r0 as zkpm_contract.aleo/initialize.future;

finalize initialize:
    set 2500u64 into world_prices[0u8];
    set 2500u64 into world_prices[1u8];
    set 2500u64 into world_prices[2u8];
    set 2500u64 into world_prices[3u8];
    set 0u64 into total_volume[0u8];

function place_bet:
    input r0 as u8.private;
    input r1 as u64.private;
    lt r0 4u8 into r2;
    assert.eq r2 true;
    gt r1 0u64 into r3;
    assert.eq r3 true;
    cast self.caller r0 r1 2500u64 into r4 as Bet.record;
    async place_bet r0 r1 into r5;
    output r4 as Bet.record;
    output r5 as zkpm_contract.aleo/place_bet.future;

finalize place_bet:
    input r0 as u8.public;
    input r1 as u64.public;
    get.or_use total_volume[0u8] 0u64 into r2;
    add r2 r1 into r3;
    set r3 into total_volume[0u8];
    get.or_use world_prices[r0] 2500u64 into r4;
    add r4 10u64 into r5;
    set r5 into world_prices[r0];

function view_price:
    input r0 as u8.private;
    lt r0 4u8 into r1;
    assert.eq r1 true;
    output 2500u64 as u64.private;

constructor:
    assert.eq edition 0u16;
