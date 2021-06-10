import { CaptchaConfig, CaptchaService, CaptchaSolveOptions } from "../types/Captcha";
import { makeid } from "../util/Util";

export abstract class CaptchaProvider {
	public service: CaptchaService;
	public uuid: string;
	public key: string;
	public balance?: number = 0;

	constructor() {
		if (!this.uuid) this.uuid = makeid();
		this.getBalance();
	}

	async getBalance() {
		return this.balance;
	}

	solve(opts: CaptchaSolveOptions): Promise<string> {
		throw new Error("not implemented");
	}

	getConfig(): CaptchaConfig {
		return {
			service: this.service,
			uuid: this.uuid,
			key: this.key,
			balance: this.balance,
		};
	}

	static fromConfig(config: CaptchaConfig) {
		const Providers = {
			"2captcha": require("./2Captcha").TwoCaptcha,
			"anti-captcha": require("./AntiCaptcha").AntiCaptcha,
			"anti-captcha-trial": require("./AntiCaptcha").AntiCaptcha,
		};

		try {
			Providers["anti-captcha-trial"] = require("./AntiCaptchaTrial");
		} catch (error) {}

		return Object.assign(new Providers[config.service](config.key), config);
	}
}