## dsd-email-engine
Maybank's Digital Skills Development email processing application.

* TODO
    * [/] Typeform Webhooks to /hook
        * [/] Typeform POST reqs configuration
            * [/] Postman integrations
        * [/] Server setup & configuration
            * [/] Express servers
        * [/] Complete flow test, hook to processors
            * [/] typeform to node.js input validations <!> requires test configs
    * [/] Analyze request payload structure
        * [/] Clean up req
    * [/] Setup Test ENV
    * [/] Parse Test ENV
    * ~~[/] MJML~~
        * ~~[/] MJML docs~~
        * ~~[/] Node + MJML: ISSUE: <img> tags in MJML components~~
            _scrubbed due to absent of an efficient method of embedding imgs/base64 URL encodingsm, (using MJML would make embedding charts costly)_
    * [/] HEML email framework configs
        * [/] Extract vals -> bind to email
            * [] calculated scores (see copywriting)
        * [/] Build UI
            * [/] Base skeleton
            * >> [] Charts
                * >> [] ISSUE -> imgs cannot be sent in HTML email
                    Possible Routes:
                    - Base64 Encodings for images
                    - As attachments
                    - Store to cloud hostings
                        - Costly
                        - Inefficient for every response, uploads images to cloud
                            - Takes space
            * >> [] Accessibility for all email clients/ Gmail, Apple Mail Client
            * [] Beautify
    * [] Demographic Data Pool
    * [] Copywriting
        * [] Financial Profile
        * [] Calculations
            * [] DIR
            * [/] Expenses (pending: pie charts)
            * [] Demographic Averages
        * [] Tips based on financial profile
    * [/] Configure email route
        * [/] nodemailer
        * [/] Mailtrap setup
            * [/] test route from /hook to mailtrap
            * [/] test route from /hook to mailbox
            * >> [] spam score <4