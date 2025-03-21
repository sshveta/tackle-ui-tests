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
/// <reference types="cypress" />

import {
    checkSuccessAlert,
    click,
    clickByText,
    inputText,
    login,
    selectUserPerspective,
} from "../../../../../../utils/utils";
import { TagCategory } from "../../../../../models/migration/controls/tagcategory";
import {
    button,
    duplicateTagTypeName,
    max40CharMsg,
    migration,
    minCharsMsg,
} from "../../../../../types/constants";
import {
    createTagCategoryButton,
    dropdownMenuTypeToggle,
    nameInput,
    positiveRankMsg,
    rankInput,
    tagsHelper,
} from "../../../../../views/tags.view";

import * as data from "../../../../../../utils/data_utils";
import * as commonView from "../../../../../views/common.view";

describe(["@tier2"], "Tag category validations", () => {
    before("Login", function () {
        login();
    });

    it("Tag type field validations", function () {
        // Navigate to Tags tab and click "Create tag type" button
        TagCategory.openList();
        clickByText(button, createTagCategoryButton);

        // Name constraints
        inputText(nameInput, data.getRandomWord(2));
        cy.get(tagsHelper).should("contain", minCharsMsg);
        inputText(nameInput, data.getRandomWords(40));
        cy.get(tagsHelper).should("contain", max40CharMsg);

        // Rank constraint
        inputText(rankInput, data.getRandomNumber(-10, -20));
        cy.get(tagsHelper).should("contain", positiveRankMsg);

        cy.get(commonView.submitButton).should("be.disabled");

        // Validate the create button is enabled with valid inputs
        inputText(nameInput, data.getRandomWord(6));
        inputText(rankInput, data.getRandomNumber(5, 15));
        click(dropdownMenuTypeToggle);
        clickByText(button, data.getColor());
        cy.get(commonView.submitButton).should("not.be.disabled");

        // Close the form
        cy.get(commonView.cancelButton).click();
    });

    it("Tag category button validations", function () {
        // Navigate to Tags tab and click "Create tag category" button
        TagCategory.openList();
        clickByText(button, createTagCategoryButton);

        // Check "Create" and "Cancel" button status
        cy.get(commonView.submitButton).should("be.disabled");
        cy.get(commonView.cancelButton).should("not.be.disabled");

        // Cancel creating new tag category
        cy.get(commonView.cancelButton).click();
        cy.wait(100);

        clickByText(button, createTagCategoryButton);

        // Close the "Create tag type" form
        cy.get(commonView.closeButton).click();
        cy.wait(100);

        // Assert that Tags tab is opened
        cy.contains(button, createTagCategoryButton).should("exist");
    });

    it("Tag category success alert and unique constraint validation", function () {
        selectUserPerspective(migration);
        const tagCategory = new TagCategory(
            data.getRandomWord(5),
            data.getColor(),
            data.getRandomNumber(5, 15)
        );

        // Create a new tag type
        tagCategory.create();
        checkSuccessAlert(
            commonView.successAlertMessage,
            "Success alert:Tag category was successfully created."
        );
        cy.wait(2000);

        // Click "Create tag category" button
        clickByText(button, createTagCategoryButton);

        // Check tag category name duplication
        inputText(nameInput, tagCategory.name);
        click(dropdownMenuTypeToggle);
        clickByText(button, data.getColor());
        cy.get(tagsHelper).should("contain.text", duplicateTagTypeName);
        cy.get(commonView.closeButton).click();

        // Delete created tag
        tagCategory.delete();
    });
});
