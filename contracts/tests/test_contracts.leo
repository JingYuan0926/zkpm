// The 'test_contracts' test program.
import contracts.aleo;
program test_contracts.aleo {
    @test
    script test_it() {
        let result: u32 = contracts.aleo/main(1u32, 2u32);
        assert_eq(result, 3u32);
    }

    @test
    @should_fail
    transition do_nothing() {
        let result: u32 = contracts.aleo/main(2u32, 3u32);
        assert_eq(result, 3u32);
    }

    @noupgrade
    async constructor() {}
}
