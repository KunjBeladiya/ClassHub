// const prisma = require("../config/db.js");
// import { Server } from 'socket.io';

// const createForum = async (req, res) => {
//   try {
//     const { title, content } = req.body;
//     const userId = req.userId;

//     const forum = await prisma.forum.create({
//       data: {
//         title,
//         content,
//         authorId: userId,
//       },
//       include: { author: true },
//     });

//     // Emit socket event to all clients
//     req.io.emit('new-forum', forum);

//     res.status(201).json({success:false , forum});
//   } catch (err) {
//     console.error('Error creating forum:', err);
//     res.status(500).json({ success:false,error: 'Internal server error' });
//   }
// }

// const getAllForums =  async (req, res) => {
//   try {
//     const forums = await prisma.forum.findMany({
//       orderBy: { createdAt: 'desc' },
//       include: {
//         _count: {
//           select: { replies: true, likes: true },
//         },
//         author: true,
//       },
//     });

//     res.json({success:true , forums});
//   } catch (err) {
//     console.error('Error fetching forums:', err);
//     res.status(500).json({success:false, error: 'Internal server error' });
//   }
// }

// module.exports = { createForum };