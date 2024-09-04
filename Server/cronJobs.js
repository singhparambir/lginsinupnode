// import cron from 'node-cron';
// import User from './Model/UserModal.js';

// // Cron job to run every minute


// cron.schedule('* * * * *', async () => {
//     try {
//         const expiredTokens = await User.updateMany(
//             {
//                 resetTokenExpiry: { $lt: Date.now() }, // Tokens older than now
//                 scheduling: 0  // Only target tokens that haven't been marked as expired
//             },
//             {
//                 $set: { scheduling: 1 } // Set scheduling to 1, marking them as expired
//             }
//         );


//         if (expiredTokens.nModified > 0) {
//             console.log(`Expired reset tokens have been marked as expired. Updated count: ${expiredTokens.nModified}`);
//         }

//     } catch (error) {
//         console.error('Error in cron job:', error);
//     }
// });