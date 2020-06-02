## dsd-email-engine
Maybank's Digital Skills Development email processing application.

* TODO
    * ✅ Typeform Webhooks to /hook
        * ✅ Typeform POST reqs configuration
            * ✅ Postman integrations
        * ✅ Server setup & configuration
            * ✅ Express servers
        * ✅ Complete flow test, hook to processors
            * ✅ typeform to node.js input validations ⚠️ requires test configs
            * ✅ Promise cycle
                * ✅ Promise chaining
    * ✅ Analyze request payload structure
        * ✅ Clean up req
    * ✅ Setup Test ENV
    * ✅ Parse Test ENV
    * ~~✅ MJML~~
        * ~~✅ MJML docs~~
        * ~~✅ Node + MJML: ISSUE: <img> tags in MJML components~~
            _scrubbed due to absent of an efficient method of embedding imgs/base64 URL encodings, (using MJML would make embedding charts costly)_
    * ✅ HEML email framework configs
        * ✅ Extract vals -> bind to email
            * [] calculated scores (see copywriting)
        * ✅ Build UI
            * ✅ Base skeleton
            * 🔨 [] Charts
                * [] ⚠️ ISSUE -> imgs cannot be sent in HTML email
                    Possible Routes:
                    - Base64 Encodings for images
                    - As attachments
                    - Store to cloud hostings
                        - Costly
                        - Inefficient for every response, uploads images to cloud
                            - Takes space
                * [] Charts as Image on NodeJS
                    * [] VEGA
                        - Sort of like D3
                        * [] Transform response data to VEGA data schematic
                        * [] Generate PNG from VEGA
                        * [] Convert PNG to Base64 Image
                        * [] Bind images to email
                        * [] PNG Cleanup 
                    - node-chart-js
                        - ! requires OS dependencies. Issue when deploy ?
        * [] Move HEML to a diff script for readibility
        * [] Accessibility for all email clients: Gmail, Apple Mail Client
        * [] Beautify
    * [] Demographic Data Pool
    * [] Copywriting
        * [] Financial Profile
        * [] Calculations
            * [] DIR
            * [] Expenses (pending: pie charts)
            * [] Demographic Averages
        * [] Tips based on financial profile
    * ✅ Configure email route
        * ✅ nodemailer
        * ✅ Mailtrap setup
            * ✅ test route from /hook to mailtrap
            * ✅ test route from /hook to mailbox
            * 🔧 [] spam score <4
    * [] Post email-generation
        * [] Data channeled to centralized DB for population analysis
            * [] GraphQL / NoSQL db
                * [] Schematic definitions
                * [] Queries for averages