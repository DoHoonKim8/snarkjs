import * as snarkjs from "../main.js";
import { getCurveFromName } from "../src/curves.js";
import assert from "assert";
import path from "path";
import fs from "fs";

import Logger from "logplease";

const logger = Logger.create("snarkJS", { showTimestamp: false });
Logger.setLogLevel("DEBUG");

class Groth16Scheme {
	constructor() {
		this.ptau_final = { type: "mem" };
		this.wtns = { type: "mem" };
		this.zkey_0 = { type: "mem" };
		this.zkey_1 = { type: "mem" };
		this.zkey_2 = { type: "mem" };
		this.zkey_final = { type: "mem" };
		this.bellman_1 = { type: "mem" };
		this.bellman_2 = { type: "mem" };
		this.vKey;
		this.proof;
		this.publicSignals;
		this.circuitName;
	}

	async powersOfTau() {
		this.curve = await getCurveFromName("bn128");
		const ptau_0 = { type: "mem" };
		const ptau_1 = { type: "mem" };
		const ptau_2 = { type: "mem" };
		const ptau_beacon = { type: "mem" };
		const ptau_challenge2 = { type: "mem" };
		const ptau_response2 = { type: "mem" };

		// powersoftau new
		await snarkjs.powersOfTau.newAccumulator(this.curve, 11, ptau_0);

		// powersoftau contribute
		await snarkjs.powersOfTau.contribute(ptau_0, ptau_1, "C1", "Entropy1");

		// powersoftau export challenge
		await snarkjs.powersOfTau.exportChallenge(ptau_1, ptau_challenge2);

		// powersoftau challenge contribute
		await snarkjs.powersOfTau.challengeContribute(
			this.curve,
			ptau_challenge2,
			ptau_response2,
			"Entropy2"
		);
		
		// powersoftau import response
		await snarkjs.powersOfTau.importResponse(
			ptau_1,
			ptau_response2,
			ptau_2,
			"C2",
			true
		);

		// powersoftau beacon
		await snarkjs.powersOfTau.beacon(
			ptau_2,
			ptau_beacon,
			"B3",
			"0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20",
			10
		);

		// powersoftau prepare phase2
		await snarkjs.powersOfTau.preparePhase2(ptau_beacon, this.ptau_final);

		// powersoftau verify
		const res = await snarkjs.powersOfTau.verify(this.ptau_final);
		assert(res);
	}

	setCircuitName(circuitName) {
		this.circuitName = circuitName;
	}

	async calculateWtns() {
		let wtnsFilePath = `test/witness/${this.circuitName}.json`;
		let witness = JSON.parse(fs.readFileSync(wtnsFilePath));

		// witness calculate
		await snarkjs.wtns.calculate(
			witness,
			path.join("test", "circuit", `${this.circuitName}.wasm`),
			this.wtns
		);
	}

	async setup() {
		await snarkjs.zKey.newZKey(
			path.join("test", "circuit", `${this.circuitName}.r1cs`),
			this.ptau_final,
			this.zkey_0
		);
	}

	async phase2() {
		await snarkjs.zKey.contribute(this.zkey_0, this.zkey_1, "p2_C1", "pa_Entropy1");
		await snarkjs.zKey.exportBellman(this.zkey_1, this.bellman_1);
		await snarkjs.zKey.bellmanContribute(
			this.curve,
			this.bellman_1,
			this.bellman_2,
			"pa_Entropy2"
		);
		await snarkjs.zKey.importBellman(this.zkey_1, this.bellman_2, this.zkey_2, "C2");
		await snarkjs.zKey.beacon(
			this.zkey_2,
			this.zkey_final,
			"B3",
			"0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20",
			10
		);
		const res = await snarkjs.zKey.verifyFromR1cs(
			path.join("test", "circuit", `${this.circuitName}.r1cs`),
	 		this.ptau_final,
			this.zkey_final
		);
		assert(res);
		const res2 = await snarkjs.zKey.verifyFromInit(
			this.zkey_0,
			this.ptau_final,
			this.zkey_final
		);
		assert(res2);
	}

	async exportVerificationKey() {
		this.vKey = await snarkjs.zKey.exportVerificationKey(this.zkey_final);	
	}

	async generateProof() {
		const res = await snarkjs.groth16.prove(this.zkey_final, this.wtns);
		this.proof = res.proof;
		this.publicSignals = res.publicSignals;
	}

	async verify() {
		const res = await snarkjs.groth16.verify(
			this.vKey, 
			this.publicSignals, 
			this.proof
		);
		assert(res == true);	
	}
}

class PlonkScheme {
	constructor() {
		this.ptau_final = { type: "mem" };
		this.wtns = { type: "mem" };
		this.zkey_plonk = { type: "mem" };
		this.vKey;
		this.proof;
		this.publicSignals;
		this.circuitName;
	}

	async powersOfTau() {
		let curve = await getCurveFromName("bn128");
		const ptau_0 = { type: "mem" };
		const ptau_1 = { type: "mem" };
		const ptau_2 = { type: "mem" };
		const ptau_beacon = { type: "mem" };
		const ptau_challenge2 = { type: "mem" };
		const ptau_response2 = { type: "mem" };

		// powersoftau new
		await snarkjs.powersOfTau.newAccumulator(curve, 11, ptau_0);

		// powersoftau contribute
		await snarkjs.powersOfTau.contribute(ptau_0, ptau_1, "C1", "Entropy1");

		// powersoftau export challenge
		await snarkjs.powersOfTau.exportChallenge(ptau_1, ptau_challenge2);

		// powersoftau challenge contribute
		await snarkjs.powersOfTau.challengeContribute(
			curve,
			ptau_challenge2,
			ptau_response2,
			"Entropy2"
		);
		
		// powersoftau import response
		await snarkjs.powersOfTau.importResponse(
			ptau_1,
			ptau_response2,
			ptau_2,
			"C2",
			true
		);

		// powersoftau beacon
		await snarkjs.powersOfTau.beacon(
			ptau_2,
			ptau_beacon,
			"B3",
			"0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20",
			10
		);

		// powersoftau prepare phase2
		await snarkjs.powersOfTau.preparePhase2(ptau_beacon, this.ptau_final);

		// powersoftau verify
		const res = await snarkjs.powersOfTau.verify(this.ptau_final);
		assert(res);
	}

	setCircuitName(circuitName) {
		this.circuitName = circuitName;
	}

	async calculateWtns() {
		let wtnsFilePath = `test/witness/${this.circuitName}.json`;
		let witness = JSON.parse(fs.readFileSync(wtnsFilePath));
		
		// witness calculate
		await snarkjs.wtns.calculate(
			witness,
			path.join("test", "circuit", `${this.circuitName}.wasm`),
			this.wtns
		);
	}

	async setup() {
		await snarkjs.plonk.setup(
			path.join("test", "circuit", `${this.circuitName}.r1cs`),
			this.ptau_final,
			this.zkey_plonk,
			logger
		);
	}

	async exportVerificationKey() {
		this.vKey = await snarkjs.zKey.exportVerificationKey(this.zkey_plonk);
	}

	async generateProof() {
			const res = await snarkjs.plonk.prove(this.zkey_plonk, this.wtns, logger);
			this.proof = res.proof;
			this.publicSignals = res.publicSignals;
	}

	async verify() {
		const res = await snarkjs.plonk.verify(
			this.vKey,
			this.publicSignals,
			this.proof,
			logger
		);
		assert(res == true);
	}
}

let plonk = new PlonkScheme();
let groth16 = new Groth16Scheme();

// plonk test
await plonk.powersOfTau();

// plonk.setCircuitName('binsum');
// await plonk.calculateWtns();
// await plonk.setup();
// await plonk.exportVerificationKey();

// it("generate plonk proof binsum", async () => {
// 	await plonk.generateProof();
// });
// plonk.verify();

plonk.setCircuitName('binsub');
await plonk.calculateWtns();
await plonk.setup();
await plonk.exportVerificationKey();


await plonk.generateProof();
// plonk.verify();

// groth16 test
// await groth16.powersOfTau();

// groth16.setCircuitName('batchUstCircuit');
// await groth16.calculateWtns();
// await groth16.setup();
// await groth16.phase2();
// await groth16.exportVerificationKey();

// it("generate groth16 proof for batchUstCircuit", async () => {
// 	await groth16.generateProof();
// });
// groth16.verify();


// groth16.setCircuitName('binsum');
// await groth16.calculateWtns();
// await groth16.setup();
// await groth16.phase2();
// await groth16.exportVerificationKey();

// it("generate groth16 proof for binsum", async () => {
// 	await groth16.generateProof();
// });
// // groth16.verify();

// groth16.setCircuitName('binsub');
// await groth16.calculateWtns();
// await groth16.setup();
// await groth16.phase2();
// await groth16.exportVerificationKey();

// it("generate groth16 proof for binsub", async () => {
// 	await groth16.generateProof();
// });
// // groth16.verify();
