// src/mailtrap/emails.ts

// 1. Send Verification Email (Mock)
export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    console.log(`
    -------------------------------------------
    📧 [MOCK EMAIL] Sending Verification Email
    👤 To: ${email}
    🔑 Code: ${verificationToken}
    -------------------------------------------
    `);

    // We return a resolved Promise so the controller thinks it worked perfectly
    return Promise.resolve();
};

// 2. Send Welcome Email (Mock)
export const sendWelcomeEmail = async (email: string, name: string) => {
    console.log(`
    -------------------------------------------
    📧 [MOCK EMAIL] Sending Welcome Email
    👤 To: ${email}
    👋 Message: Welcome to the app, ${name}!
    -------------------------------------------
    `);
    return Promise.resolve();
};

// 3. Send Password Reset Email (Mock)
export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
    console.log(`
    -------------------------------------------
    📧 [MOCK EMAIL] Sending Password Reset
    👤 To: ${email}
    🔗 Link: ${resetURL}
    -------------------------------------------
    `);
    return Promise.resolve();
};

// 4. Send Reset Success Email (Mock)
export const sendResetSuccessEmail = async (email: string) => {
    console.log(`
    -------------------------------------------
    📧 [MOCK EMAIL] Password Reset Successful
    👤 To: ${email}
    -------------------------------------------
    `);
    return Promise.resolve();
};

// export const sendPasswordResetEmail = async (email, resetURL) => {
// 	const recipient = [{ email }];

// 	try {
// 		const response = await mailtrapClient.send({
// 			from: sender,
// 			to: recipient,
// 			subject: "Reset your password",
// 			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
// 			category: "Password Reset",
// 		});
// 	} catch (error) {
// 		console.error(`Error sending password reset email`, error);

// 		throw new Error(`Error sending password reset email: ${error}`);
// 	}
// };
