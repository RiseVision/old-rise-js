if (typeof module !== 'undefined' && module.exports) {
	var common = require('../common');
	var lisk = common.lisk;
	process.env.NODE_ENV = 'test';
}

describe('Lisk.api()', function () {

	var LSK = lisk.api();

	describe('lisk.api()', function () {

		it('should create a new instance when using lisk.api()', function () {
			(LSK).should.be.ok();
		});

		it('new lisk.api() should be Object', function () {
			(LSK).should.be.type('object');
		});
	});

	describe('#listPeers', function () {
		it('should give a set of the peers', function () {
			(LSK.listPeers()).should.be.ok;
			(LSK.listPeers()).should.be.type.Object;
			(LSK.listPeers().official.length).should.be.equal(8);
			(LSK.listPeers().testnet.length).should.be.equal(1);
		});
	});

	describe('.currentPeer', function () {

		it('currentPeer should be set by default', function () {
			(LSK.currentPeer).should.be.ok;
		});
	});

	describe('#getNethash', function () {

		it('Nethash should be hardcoded variables', function () {
			var NetHash = {
				'Content-Type': 'application/json',
				'nethash': '7337a324ef27e1e234d1e9018cacff7d4f299a09c2df9be460543b8f7ef652f1',
				'broadhash': '7337a324ef27e1e234d1e9018cacff7d4f299a09c2df9be460543b8f7ef652f1',
				'os': 'shift-js-api',
				'version': '6.5.0',
				'minVersion': '>=6.5.0',
				'port': 9305
			};
			(LSK.getNethash()).should.eql(NetHash);
		});

		it('should give corret Nethash for testnet', function () {
			LSK.setTestnet(true);

			var NetHash = {
				'Content-Type': 'application/json',
				'nethash': 'cba57b868c8571599ad594c6607a77cad60cf0372ecde803004d87e679117c12',
				'broadhash': 'cba57b868c8571599ad594c6607a77cad60cf0372ecde803004d87e679117c12',
				'os': 'shift-js-api',
				'version': '6.5.0',
				'minVersion': '>=6.5.0',
				'port': 9405
			};

			(LSK.getNethash()).should.eql(NetHash);
		});


		it('should be possible to use my own Nethash', function () {
			var NetHash = {
				'Content-Type': 'application/json',
				'nethash': '123',
				'broadhash': 'ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511',
				'os': 'lisk-js-api',
				'version': '0.0.0a',
				'minVersion': '>=0.5.0',
				'port': 8000
			};
			var LSKNethash = lisk.api({ nethash: '123' });

			(LSKNethash.nethash).should.eql(NetHash);
		});
	});

	describe('#setTestnet', function () {

		it('should set to testnet', function () {
			var LISK = lisk.api();
			LISK.setTestnet(true);

			(LISK.testnet).should.be.true;
		});

		it('should set to mainnet', function () {
			var LISK = lisk.api();
			LISK.setTestnet(false);

			(LISK.testnet).should.be.false;
		});
	});

	describe('#setNode', function () {

		it('should be able to set my own node', function () {
			var myOwnNode = 'myOwnNode.com';
			LSK.setNode(myOwnNode);

			(LSK.currentPeer).should.be.equal(myOwnNode);
		});

		it('should select a node when not explicitly set', function () {
			LSK.setNode();

			(LSK.currentPeer).should.be.ok();
		});
	});

	describe('#selectNode', function () {

		it('should return the node from initial settings when set', function () {
			var LiskUrlInit = lisk.api({ port: 7000, node: 'localhost', ssl: true, randomPeer: false });

			(LiskUrlInit.selectNode()).should.be.equal('localhost');
		});
	});

	describe('#getRandomPeer', function () {

		it('should give a random peer', function () {
			(LSK.getRandomPeer()).should.be.ok();
		});
	});

	describe('#banNode', function () {

		it('should add current node to LSK.bannedPeers', function () {
			var currentNode = LSK.currentPeer;
			LSK.banNode();

			(LSK.bannedPeers).should.containEql(currentNode);
		});
	});

	describe('#getFullUrl', function () {

		it('should give the full url inclusive port', function () {
			var LiskUrlInit = lisk.api({ port: 7000, node: 'localhost', ssl: false });
			var fullUrl = 'http://localhost:7000';

			(LiskUrlInit.getFullUrl()).should.be.equal(fullUrl);
		});

		it('should give the full url without port and with SSL', function () {
			var LiskUrlInit = lisk.api({ port: '', node: 'localhost', ssl: true });
			var fullUrl = 'https://localhost';

			(LiskUrlInit.getFullUrl()).should.be.equal(fullUrl);
		});
	});

	describe('#getURLPrefix', function () {

		it('should be http when ssl is false', function () {
			LSK.setSSL(false);

			(LSK.getURLPrefix()).should.be.equal('http');
		});

		it('should be https when ssl is true', function () {
			LSK.setSSL(true);

			(LSK.getURLPrefix()).should.be.equal('https');
		});
	});

	describe('#trimObj', function () {

		var untrimmedObj = {
			' my_Obj ': ' myval '
		};

		var trimmedObj = {
			'my_Obj': 'myval'
		};

		it('should not be equal before trim', function () {
			(untrimmedObj).should.not.be.equal(trimmedObj);
		});

		it('should be equal after trim an Object in keys and value', function () {
			var trimIt = LSK.trimObj(untrimmedObj);

			(trimIt).should.be.eql(trimmedObj);
		});

		it('should accept numbers and strings as value', function () {
			var obj = {
				'myObj': 2
			};

			var trimmedObj = LSK.trimObj(obj);
			(trimmedObj).should.be.ok;
			(trimmedObj).should.be.eql({ myObj: '2' });
		});
	});

	describe('#toQueryString', function () {

		it('should create a http string from an object. Like { obj: "myval", key: "myval" } -> obj=myval&key=myval', function () {
			var myObj = {
				obj: 'myval',
				key: 'my2ndval'
			};

			var serialised = LSK.toQueryString(myObj);

			(serialised).should.be.equal('obj=myval&key=my2ndval');
		});
	});

	describe('#serialiseHttpData', function () {

		it('should create a http string from an object and trim.', function () {
			var myObj = {
				obj: ' myval',
				key: 'my2ndval '
			};

			var serialised = LSK.serialiseHttpData(myObj);

			(serialised).should.be.equal('?obj=myval&key=my2ndval');
		});
	});

	describe('#getAddressFromSecret', function () {

		it('should create correct address and publicKey', function () {
			var address = {
				publicKey: 'a4465fd76c16fcc458448076372abf1912cc5b150663a64dffefe550f96feadd',
				address: '12475940823804898745L'
			};

			(LSK.getAddressFromSecret('123')).should.eql(address);
		});
	});

	describe('#checkRequest', function () {

		it('should identify GET requests', function () {
			var requestType = 'api/loader/status';
			var options = '';
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');

			var requestType = 'api/loader/status/sync';
			var options = '';
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');

			var requestType = 'api/loader/status/ping';
			var options = '';
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');

			var requestType = 'api/transactions';
			var options = {blockId: '123', senderId: '123'};
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('GET');
		});

		it('should identify POST requests', function () {
			var requestType = 'accounts/generatePublicKey';
			var options = {secret: '123'};
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('POST');

			var requestType = 'accounts/open';
			var options = {secret: '123'};
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('POST');

			var requestType = 'multisignatures/sign';
			var options = {secret: '123'};
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('POST');
		});

		it('should identify PUT requests', function () {
			var requestType = 'accounts/delegates';
			var options = {secret: '123'};
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('PUT');

			var requestType = 'signatures';
			var options = {secret: '123'};
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('PUT');

			var requestType = 'transactions';
			var options = {secret: '123'};
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('PUT');
		});

		it('should identify NOACTION requests', function () {
			var requestType = 'delegates/forging/enable';
			var options = {secret: '123'};
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('NOACTION');

			var requestType = 'dapps/uninstall';
			var options = {secret: '123'};
			var checkRequestAnswer = LSK.checkRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.equal('NOACTION');
		});
	});

	describe('#checkOptions', function () {

		it('should not accept falsy options like undefined', function (done) {
			try {
				lisk.api().sendRequest('delegates/', {limit:undefined}, function () {});
			} catch (e) {
				(e.message).should.be.equal('parameter value "limit" should not be undefined');
				done();
			}
		});

		it('should not accept falsy options like NaN', function (done) {
			try {
				lisk.api().sendRequest('delegates/', {limit:NaN}, function () {});
			} catch (e) {
				(e.message).should.be.equal('parameter value "limit" should not be NaN');
				done();
			}
		});
		
	});

	describe('#changeRequest', function () {

		it('should give the correct parameters for GET requests', function () {
			var requestType = 'transactions';
			var options = {blockId: '123', senderId: '123'};
			var checkRequestAnswer = lisk.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: 'GET',
				requestParams: {
					blockId: '123',
					senderId: '123'
				},
				requestUrl: 'http://localhost:8000/api/transactions?blockId=123&senderId=123'
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for GET requests with parameters', function () {
			var requestType = 'delegates/search/';
			var options = {q: 'oliver'};
			var checkRequestAnswer = lisk.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: 'GET',
				requestParams: {
					q: 'oliver',
				},
				requestUrl: 'http://localhost:8000/api/delegates/search/?q=oliver'
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for NOACTION requests', function () {
			var requestType = 'delegates/forging/enable';
			var options = {secret: '123'};
			var checkRequestAnswer = lisk.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: '',
				requestParams: '',
				requestUrl: ''
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for POST requests', function () {
			var requestType = 'accounts/open';
			var options = {secret: '123'};
			var checkRequestAnswer = lisk.api({ node: 'localhost' }).changeRequest(requestType, options);

			var output = {
				nethash: '',
				requestMethod: 'GET',
				requestParams: {secret: '123'},
				requestUrl: 'http://localhost:8000/api/accounts?address=12475940823804898745L'
			};

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer).should.be.eql(output);
		});

		it('should give the correct parameters for PUT requests', function () {
			var requestType = 'signatures';
			var options = {secret: '123', secondSecret: '1234'};
			var checkRequestAnswer = lisk.api({ node: 'localhost' }).changeRequest(requestType, options);

			(checkRequestAnswer).should.be.ok;
			(checkRequestAnswer.requestParams.transaction).should.have.property('id').which.is.a.String();
			(checkRequestAnswer.requestParams.transaction).should.have.property('amount').which.is.a.Number();
			(checkRequestAnswer.requestParams).should.have.property('transaction').which.is.a.Object();
		});
	});

	describe('#sendRequest', function () {

		it('should receive Height from a random public peer', function (done) {
			lisk.api().sendRequest('blocks/getHeight', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				done();
			});
		});
	});

	describe('#listActiveDelegates', function () {

		it('should list active delegates', function (done) {
			lisk.api().listActiveDelegates('5', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				(data.delegates).should.have.length(5);
				done();
			});
		});
	});

	describe('#listStandbyDelegates', function () {

		it('should list standby delegates', function (done) {
			lisk.api().listStandbyDelegates('5', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				(data.delegates).should.have.length(5);
				done();
			});
		});
	});

	describe('#searchDelegateByUsername', function () {

		it('should find a delegate by name', function (done) {
			lisk.api().searchDelegateByUsername('oliver', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				(data.delegates[0].username).should.be.equal('oliver');
				done();
			});
		});
	});

	describe('#listBlocks', function () {

		it('should list amount of blocks defined', function (done) {
			lisk.api().listBlocks('3', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				(data.blocks).should.have.length(3);
				done();
			});
		});
	});

	describe('#listForgedBlocks', function () {

		it('should list amount of ForgedBlocks', function (done) {
			lisk.api().listForgedBlocks('130649e3d8d34eb59197c00bcf6f199bc4ec06ba0968f1d473b010384569e7f0', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				done();
			});
		});
	});

	describe('#getBlock', function () {

		it('should get a block of certain height', function (done) {
			lisk.api().getBlock('2346638', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				done();
			});
		});
	});

	describe('#listTransactions', function () {

		it('should list transactions of a defined account', function (done) {
			lisk.api().listTransactions('12731041415715717263L', '1', '2', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				(data.transactions.length).should.be.equal(1);
				done();
			});
		});
	});

	describe('#getTransaction', function () {

		it('should list a defined transaction', function (done) {
			lisk.api().getTransaction('7520138931049441691', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				done();
			});
		});
	});

	describe('#listVotes', function () {

		it('should list votes of an account', function (done) {
			lisk.api().listVotes('16010222169256538112L', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				done();
			});
		});
	});

	describe('#listVoters', function () {

		it('should list voters of an account', function (done) {
			lisk.api().listVoters('6a01c4b86f4519ec9fa5c3288ae20e2e7a58822ebe891fb81e839588b95b242a', function (data) {
				(data).should.be.ok;
				(data).should.be.type('object');
				(data.success).should.be.true;
				done();
			});
		});
	});

	describe('#getAccount', function () {

		it('should get account information', function (done) {
			lisk.api().getAccount('12731041415715717263L', function (data) {
				(data).should.be.ok;
				(data.account.publicKey).should.be.equal('a81d59b68ba8942d60c74d10bc6488adec2ae1fa9b564a22447289076fe7b1e4');
				(data.account.address).should.be.equal('12731041415715717263L');
				done();
			});
		});
	});

	describe('#sendLSK', function () {

		it('should send testnet LSK', function (done) {
			var options = {
				ssl: false,
				node: '',
				randomPeer: true,
				testnet: true,
				port: '7000',
				bannedPeers: []
			};

			var LSKnode = lisk.api(options);
			var secret = 'soap arm custom rhythm october dove chunk force own dial two odor';
			var secondSecret = 'spider must salmon someone toe chase aware denial same chief else human';
			var recipient = '10279923186189318946L';
			var amount = 100000000;
			LSKnode.sendLSK(recipient, amount, secret, secondSecret, function (result) {
				(result).should.be.ok;
				done();
			});
		});
	});

	describe('#checkReDial', function () {

		it('should check if all the peers are already banned', function () {
			(lisk.api().checkReDial()).should.be.equal(true);
		});

		it('should be able to get a new node when current one is not reachable', function (done) {
			lisk.api({ node: '123', randomPeer: true }).sendRequest('blocks/getHeight', {}, function (result) {
				(result).should.be.type('object');
				done();
			});
		});

		it('should recognize that now all the peers are banned for mainnet', function () {
			var thisLSK = lisk.api();
			thisLSK.bannedPeers = lisk.api().defaultPeers;

			(thisLSK.checkReDial()).should.be.equal(false);
		});

		it('should recognize that now all the peers are banned for testnet', function () {
			var thisLSK = lisk.api({ testnet: true });
			thisLSK.bannedPeers = lisk.api().defaultTestnetPeers;

			(thisLSK.checkReDial()).should.be.equal(false);
		});

		it('should recognize that now all the peers are banned for ssl', function () {
			var thisLSK = lisk.api({ssl: true});
			thisLSK.bannedPeers = lisk.api().defaultSSLPeers;

			(thisLSK.checkReDial()).should.be.equal(false);
		});

		it('should stop redial when all the peers are banned already', function (done) {
			var thisLSK = lisk.api();
			thisLSK.bannedPeers = lisk.api().defaultPeers;
			thisLSK.currentPeer = '';

			thisLSK.sendRequest('blocks/getHeight').then(function (e) {
				(e.message).should.be.equal('could not create http request to any of the given peers');
				done();
			});
		});

		it('should redial to new node when randomPeer is set true', function (done) {
			var thisLSK = lisk.api({ randomPeer: true, node: '123' });

			thisLSK.getAccount('12731041415715717263L', function (data) {
				(data).should.be.ok;
				(data.success).should.be.equal(true);
				done();
			});
		});

		it('should not redial to new node when randomPeer is set to true but unknown nethash provided', function () {
			var thisLSK = lisk.api({ randomPeer: true, node: '123', nethash: '123' });

			(thisLSK.checkReDial()).should.be.equal(false);
		});

		it('should redial to mainnet nodes when nethash is set and randomPeer is true', function () {
			var thisLSK = lisk.api({ randomPeer: true, node: '123', nethash: 'ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511' });

			(thisLSK.checkReDial()).should.be.equal(true);
			(thisLSK.testnet).should.be.equal(false);
		});

		it('should redial to testnet nodes when nethash is set and randomPeer is true', function () {
			var thisLSK = lisk.api({ randomPeer: true, node: '123', nethash: 'da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba' });

			(thisLSK.checkReDial()).should.be.equal(true);
			(thisLSK.testnet).should.be.equal(true);
		});

		it('should not redial when randomPeer is set false', function () {
			var thisLSK = lisk.api({ randomPeer: false});

			(thisLSK.checkReDial()).should.be.equal(false);
		});
	});

	describe('#sendRequest with promise', function () {

		it('should be able to use sendRequest as a promise for GET', function (done) {
			lisk.api().sendRequest('blocks/getHeight', {}).then(function (result) {
				(result).should.be.type('object');
				(result.success).should.be.equal(true);
				(result.height).should.be.type('number');
				done();
			});
		});

		it('should route the request accordingly when request method is POST but GET can be used', function (done) {
			lisk.api().sendRequest('accounts/open', { secret: '123' }).then(function (result) {
				(result).should.be.type('object');
				(result.account).should.be.ok;
				done();
			});
		});

		it('should respond with error when API call is disabled', function (done) {
			lisk.api().sendRequest('delegates/forging/enable', { secret: '123' }).then(function (result) {
				(result.error).should.be.equal('Forging not available via offlineRequest');
				done();
			});
		});

		it('should be able to use sendRequest as a promise for POST', function (done) {
			var options = {
				ssl: false,
				node: '',
				randomPeer: true,
				testnet: true,
				port: '7000',
				bannedPeers: []
			};

			var LSKnode = lisk.api(options);
			var secret = 'soap arm custom rhythm october dove chunk force own dial two odor';
			var secondSecret = 'spider must salmon someone toe chase aware denial same chief else human';
			var recipient = '10279923186189318946L';
			var amount = 100000000;

			LSKnode.sendRequest('transactions', { recipientId: recipient, secret: secret, secondSecret: secondSecret, amount: amount }).then(function (result) {
				(result).should.be.type('object');
				(result).should.be.ok;
				done();
			});
		});
	});

	describe('#listMultisignatureTransactions', function () {

		it('should list all current not signed multisignature transactions', function (done) {
			lisk.api().listMultisignatureTransactions(function (result) {
				(result).should.be.ok;
				(result).should.be.type('object');
				done();
			});
		});
	});

	describe('#getMultisignatureTransaction', function () {

		it('should get a multisignature transaction by id', function (done) {
			lisk.api().getMultisignatureTransaction('123', function (result) {
				(result).should.be.ok;
				(result).should.be.type('object');
				done();
			});
		});
	});
});
