/// <reference types="Cypress" />

describe('Storefront test data set', () => {
    /**
     * Test requirements:
     * - db `Cypress.env('dbName')` must exist
     * - install.lock must exist
     * - system is setup with the test data set
     */

    it('@storefront: top navigation', () => {
        cy.visit('/');

        cy.get('.nav > [href="/"]').should('be.visible');
        cy.get('.nav > [href$="/Frauen/"]').should('be.visible').click();
        cy.get('.nav > [href$="/Maenner/"]').should('be.visible').click();
        cy.get('.nav > [href$="/Accessoires/"]').should('be.visible').click();
        cy.get('.nav > [href$="/Angebote/"]').should('be.visible').click();
        //cy.get('.nav > [href$="/Unsere-besten-Produkte/"]').should('be.visible').click();
        //@todo remove comment after NEXT-9476 is done
        cy.get('.nav > [href$="/Fairtrade/"]').should('be.visible').click();
        cy.get('.nav > [href$="/Angebote/"]').click()

        cy.get('.home-link').click()
    });

    it('@storefront: put cargohose from cms page into cart', { tags: ['quarantined'] }, () => {
        cy.visit('/Maenner/Hosen/');

        cy.window().then((win) => {
            /** @deprecated tag:v6.5.0 - Use `CheckoutPageObject.elements.lineItem` instead */
            const lineItemSelector = win.features['v6.5.0.0'] ? '.line-item' : '.cart-item';

            cy.get('.js-cookie-configuration-button > .btn').should('be.visible').click();
            cy.get('.offcanvas-cookie > .btn').scrollIntoView().should('be.visible').click();

            cy.get('.cms-element-text > h2')
                .contains('Auf der Suche nach einer neuen Hose?')
                .should('be.visible');

            cy.get('.product-info').contains('Cargo').should('be.visible');
            cy.get('.buy-widget > .btn').should('be.visible').click();

            cy.get('.offcanvas').should('be.visible');
            cy.get(`${lineItemSelector}-label`).contains(/1x.*Cargo/).should('be.visible');

            cy.get(`${lineItemSelector}-remove > .btn`).click();
            cy.get(`${lineItemSelector}-label`).should('not.be.visible');
            cy.get('.alert-info > .alert-content-container > .alert-content')
                .contains('Warenkorb ist leer')
                .should('be.visible');

            cy.get('.offcanvas').scrollIntoView()

            cy.get('body > div.offcanvas.is-right.is-open > button').should('be.visible').click();
            cy.get('.offcanvas').should('not.be.visible');
        });
    });
    //@todo remove skip after next-9476 is done

    it('@storefront: search cargohose', { tags: ['quarantined'] }, () => {
        cy.visit('/');
        cy.get('input[type="search"]').should('be.visible').clear().type('cargohose{enter}');

        cy.get('.search-headline').contains('cargohose').should('be.visible');
        cy.get('.search-headline').contains('1 Produkt').should('be.visible');

        cy.get('.product-info').contains('Cargo').should('be.visible');
    });
    //@todo remove skip after next-9476 is done

    it('@storefront: search cargohose downarrow enter', { tags: ['quarantined'] }, () => {
        cy.visit('/');

        cy.get('input[type="search"]').should('be.visible').clear().type('cargohose');
        cy.get('.search-suggest-product-link').should('be.visible');
        cy.get('input[type="search"]').type('{downarrow}{enter}');

        cy.get('.product-detail-name').contains('Cargohose').should('be.visible');
        cy.get('.h3.product-detail-description-title')
            .contains(/Produktinformationen.*Cargohose/)
            .should('be.visible')

        cy.get('.btn-buy').should('be.visible');
    });
    //@todo remove skip after next-9476 is done
});
