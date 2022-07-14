/**
 * Copyright (c) 2022 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import { useState } from "react";
import Alert from "../components/Alert";
import Modal from "../components/Modal";

interface VerifyModalState {
    phoneNumber?: string;
    sent?: Date;
    token?: string;
}

export function VerifyModal() {
    const [state, setState] = useState<VerifyModalState>({});
    const sendCode = () => {};
    const isValidPhoneNumber = () => {
        return !!state.phoneNumber && /\+[0-9]{5,}/.test(state.phoneNumber);
    };
    return (
        <Modal
            onClose={() => {}}
            onEnter={() => false}
            title="User Validation Required"
            buttons={
                <div>
                    <button className="ml-2" disabled={!isValidPhoneNumber()} onClick={sendCode}>
                        Send Code via SMS
                    </button>
                </div>
            }
            visible={true}
        >
            <Alert type="warning" className="mt-2">
                To try Gitpod for free you'll need to validate your account with your phone number. This is required to
                discourage and reduce abuse on Gitpod infrastructure.
            </Alert>
            <div className="border-t border-gray-200 dark:border-gray-800 mt-2 -mx-6 px-6 pt-4">
                Enter your mobile phone number to verify your account.
            </div>
            <div className="mt-4">
                <h4>Mobile Phone Number</h4>
                <input
                    type="text"
                    placeholder="+123242345345"
                    value={state.phoneNumber}
                    onChange={(v) => {
                        setState({
                            ...state,
                            phoneNumber: v.currentTarget.value,
                        });
                    }}
                />
            </div>
            <div className="mt-4">
                <h4>Verification Code</h4>
                <input
                    className="w-full"
                    type="text"
                    placeholder="enter token send via sms"
                    value={state.token}
                    onChange={(v) => {
                        setState({
                            ...state,
                            token: v.currentTarget.value,
                        });
                    }}
                />
            </div>
        </Modal>
    );
}
