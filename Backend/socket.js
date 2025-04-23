// const socketIo = require('socket.io');
// const userModel = require('./model/user.model');
// const captainModel = require('./model/captain.model');

// let io;

// function initializeSocket(server) {
//     io = socketIo(server, {
//         cors: {
//             origin: '*',
//             methods: [ 'GET', 'POST' ]
//         }
//     });

//     io.on('connection', (socket) => {
//         console.log(`Client connected: ${socket.id}`);


//         socket.on('join', async (data) => {
//             const { userId, userType } = data;

//             if (userType === 'user') {
//                 await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
//             } else if (userType === 'captain') {
//                 await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
//             }
//         });


//         socket.on('update-location-captain', async (data) => {
//             const { userId, location } = data;

//             if (!location || !location.ltd || !location.lng) {
//                 return socket.emit('error', { message: 'Invalid location data' });
//             }

//             await captainModel.findByIdAndUpdate(userId, {
//                 location: {
//                     ltd: location.ltd,
//                     lng: location.lng
//                 }
//             });
//         });

//         socket.on('disconnect', () => {
//             console.log(`Client disconnected: ${socket.id}`);
//         });
//     });
// }

// const sendMessageToSocketId = (socketId, messageObject) => {

// console.log(messageObject);

//     if (io) {
//         io.to(socketId).emit(messageObject.event, messageObject.data);
//     } else {
//         console.log('Socket.io not initialized.');
//     }
// }

// module.exports = { initializeSocket, sendMessageToSocketId };





const socketIo = require('socket.io');
const userModel = require('./model/user.model');
const captainModel = require('./model/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ Client connected: ${socket.id}`);

        // JOIN EVENT
        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (!userId || !userType) {
                console.warn('❌ Missing userId or userType on join');
                return;
            }

            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    console.log(`👤 User ${userId} socketId updated: ${socket.id}`);
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                    console.log(`🚕 Captain ${userId} socketId updated: ${socket.id}`);
                }
            } catch (err) {
                console.error('🔥 Error in join event:', err.message);
            }
        });

        // CAPTAIN LOCATION UPDATE
        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.lng) {
                return socket.emit('error', { message: '❌ Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng,
                    }
                });
                console.log(`📍 Updated location for Captain ${userId}`);
            } catch (err) {
                console.error('🔥 Error updating location:', err.message);
            }
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
}

// 🔊 Send message to a socket ID
const sendMessageToSocketId = (socketId, messageObject) => {
    console.log(`📤 Emitting '${messageObject.event}' to ${socketId}`);
    console.log("🚚 Data:", JSON.stringify(messageObject.data, null, 2));

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('❌ Socket.io not initialized.');
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };
