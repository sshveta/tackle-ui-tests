/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {
    controls,
    stakeholderGroups,
    tdTag,
    button,
    createNewButton,
} from "../../../types/constants";
import { navMenu, navTab } from "../../../views/menu.view";
import {
    stakeholdergroupNameInput,
    stakeholdergroupDescriptionInput,
    stakeholdergroupMemberSelect,
} from "../../../views/stakeholdergroups.view";
import * as commonView from "../../../views/common.view";
import {
    clickByText,
    inputText,
    click,
    selectItemsPerPage,
    submitForm,
    cancelForm,
    selectFormItems,
    checkSuccessAlert,
    performRowAction,
    selectUserPerspective,
} from "../../../../utils/utils";

export class Stakeholdergroups {
    name: string;
    description: string;
    members: Array<string>;

    constructor(name: string, description?: string, members?: Array<string>) {
        this.name = name;
        if (description) this.description = description;
        if (members) this.members = members;
    }

    public static clickStakeholdergroups(): void {
        selectUserPerspective("Developer");
        clickByText(navMenu, controls);
        clickByText(navTab, stakeholderGroups);
    }

    protected fillName(name: string): void {
        inputText(stakeholdergroupNameInput, name);
    }

    protected fillDescription(description: string): void {
        inputText(stakeholdergroupDescriptionInput, description);
    }

    protected selectMembers(members: Array<string>): void {
        members.forEach(function (member) {
            selectFormItems(stakeholdergroupMemberSelect, member);
        });
    }

    create(cancel = false): void {
        Stakeholdergroups.clickStakeholdergroups();
        clickByText(button, createNewButton);
        if (cancel) {
            cancelForm();
        } else {
            this.fillName(this.name);
            if (this.description) this.fillDescription(this.description);
            if (this.members) {
                this.selectMembers(this.members);
            }
            submitForm();
            checkSuccessAlert(
                commonView.successAlertMessage,
                `Success! ${this.name} was added as a(n) stakeholder group.`
            );
        }
    }

    edit(
        updatedValue: {
            name?: string;
            description?: string;
            members?: Array<string>;
        },
        cancel = false
    ): void {
        Stakeholdergroups.clickStakeholdergroups();
        selectItemsPerPage(100);
        cy.wait(2000);
        performRowAction(this.name, "Edit");
        if (cancel) {
            cancelForm();
        } else {
            if (updatedValue.name && updatedValue.name != this.name) {
                this.fillName(updatedValue.name);
                this.name = updatedValue.name;
            }
            if (updatedValue.description && updatedValue.description != this.description) {
                this.fillDescription(updatedValue.description);
                this.description = updatedValue.description;
            }
            if (updatedValue.members && updatedValue.members.length != 0) {
                this.selectMembers(updatedValue.members);
                this.members = updatedValue.members;
            }
            if (updatedValue) submitForm();
        }
    }

    delete(cancel = false): void {
        Stakeholdergroups.clickStakeholdergroups();
        selectItemsPerPage(100);
        cy.wait(2000);
        performRowAction(this.name, "Delete");
        if (cancel) {
            cancelForm();
        } else {
            click(commonView.confirmButton);
        }
    }
}
