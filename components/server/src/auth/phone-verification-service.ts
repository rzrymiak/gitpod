/**
 * Copyright (c) 2022 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { User } from "@gitpod/gitpod-protocol";
import { log } from "@gitpod/gitpod-protocol/lib/util/logging";
import { inject, injectable, postConstruct } from "inversify";
import { Config } from "../config";
import { Twilio } from "twilio";
import { ServiceContext } from "twilio/lib/rest/verify/v2/service";
import { WorkspaceDB } from "@gitpod/gitpod-db/lib";

@injectable()
export class PhoneVerificationService {
    @inject(Config) protected config: Config;
    @inject(WorkspaceDB) protected workspaceDB: WorkspaceDB;

    protected verifyService: ServiceContext;

    @postConstruct()
    protected initialize(): void {
        if (this.config.twilioConfig) {
            const client = new Twilio(this.config.twilioConfig.accountSID, this.config.twilioConfig.authToken);
            this.verifyService = client.verify.v2.services(this.config.twilioConfig.serviceName);
        }
    }

    public async needsVerification(user: User): Promise<boolean> {
        if (!this.config.twilioConfig) {
            return false;
        }
        if (!!user.additionalData?.profile?.verifiedPhoneNumber) {
            return false;
        }
        return true;
    }

    public async sendVerificationToken(phoneNumber: string): Promise<void> {
        if (!this.verifyService) {
            throw new Error("No verification service configured.");
        }
        const verification = await this.verifyService.verifications.create({ to: phoneNumber, channel: "sms" });
        log.info("Verification code sent", { phoneNumber, status: verification.status });
    }

    public async verifyVerificationToken(phoneNumber: string, oneTimePassword: string): Promise<boolean> {
        if (!this.verifyService) {
            throw new Error("No verification service configured.");
        }
        const verification_check = await this.verifyService.verificationChecks.create({
            to: phoneNumber,
            code: oneTimePassword,
        });
        return verification_check.status === "approved";
    }
}
