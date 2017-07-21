/**
 * `constants` are the objects containing information about the fee size for different tranasctions.
 *
 * @property constants
 * @static
 * @type object
 */

module.exports = {
	fees: {
		send: 10000000,
		signature: 500000000,
		delegate: 2500000000,
		vote: 100000000,
		multisignature: 500000000,
		dapp: 2500000000
	},
	fee: {
		0: 1000000,
		1: 10000000,
		2: 6000000000,
		3: 100000000,
		4: 50000000,
		5: 2500000000
	}
};
