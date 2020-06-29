# dsd-email-engine
Maybank's Digital Skills Development email processing application.

<<<<<<< HEAD
This project will take responses on Digital Skills Development's (survey)[https://malayanbanking.typeform.com/to/n4YTpi] on studying the public's financial habits and processes a report out of the submission results.

## Execution Flow

1. User submits the form.
2. The application, which listens to the Typeform Webhooks API will receive the responses.
3. Application will clean up the data and sends it to three different promises.
4. One will create a Base64 Encoded image, which is the pie chart on the generated report to be embedded within the report.
5. One will do a pre-analysis on determining the results financial profile group.
6. One will generate a HTML email layout, using (HEML)[https://www.heml.io]
7. Once all promises have been fulfilled, the app sends an email to the user-submitted email address using (Nodemailer)[https://nodemailer.com/about/]. (For development reasons, current mails are trapped with (Mailtrap)[https://mailtrap.io/]).
8. The app will also aggregate the response with all recorded records.
=======
## Change 1
>>>>>>> 539acc04491003e3b791beaacf089fdd0b050db1
