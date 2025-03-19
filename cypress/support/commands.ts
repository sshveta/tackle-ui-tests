/*
 * Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

require("cy-verify-downloads").addCustomCommand();
require("cypress-downloadfile/lib/downloadFileCommand");

Cypress.Commands.add(
    "dragAndDrop",
    (dragElement: Cypress.Chainable, dropElement: Cypress.Chainable) => {
        dragElement
            .realMouseDown({ button: "left", position: "center" })
            .realMouseMove(0, 10, { position: "center" })
            .wait(200);
        dropElement.realMouseMove(0, 0, { position: "topLeft" }).realMouseUp().wait(200);
    }
);

Cypress.Commands.overwrite("log", (log, message, ...args) => {
    // print the to Cypress Command Log
    // to preserve the existing functionality
    log(message, ...args);
    // send the formatted message down to the Node
    // callback in the cypress.config.js to be printed to the terminal
    cy.task("print", [message, ...args].join(", "), { log: false });
});
