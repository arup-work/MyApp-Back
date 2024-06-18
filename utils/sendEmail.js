import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import transporter from '../config/transporter.js'


const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/**
 * 
 * 
    import.meta.url: This gives you the URL of the current module file.

    fileURLToPath: This function converts a file URL to a file path. Since import.meta.url gives a URL, we use this function to convert it to a file path.

    dirname: This function, from the path module, returns the directory name of a path. It's used to extract the directory part from the file path.
 */

const sendEmail = async({ email, subject, template, context }) => {
    const templatePath = path.join(__dirname, '../views', template);

    const html = await ejs.renderFile(templatePath, context);
    // ejs.renderFile(): This function is provided by the EJS library. It reads an EJS template file and renders it into HTML using the provided context data.

    const mailOption = {
        from : process.env.EMAIL_USERNAME,
        to : email,
        subject : subject,
        html : html
    };

    await transporter.sendMail(mailOption);
}

export default sendEmail;