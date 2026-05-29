import express from "express";
import { Server } from "socket.io";
import http from "http";
import config from "../config.js";
import getUserDetailsFromToken from "../helpers/getUserDetailsFromToken.js";
import getConversation from "../helpers/getConversation.js";
import db from "../db/index.js";


const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: {
    origin: config.FRONTEND,
    credentials: true,
  },
});
const onlineUser = new Set();
// CHATROOMs
const inChatRoomJustChatting = new Set();
// SOCKET IS RUNNING AT http://localhost:5173/
io.on("connection", async (socket) => {
  // USER DETAILS --------------------------------------------
  const token = socket.handshake.auth.token;
  const user = await getUserDetailsFromToken(token);
  // CREATE A ROOM -------------------------------------------
  socket.join(user?._id.toString());
  // Immediately emit user's messages upon connection
  const userWithMessages = await db.User.findById(user?._id).populate("messages");
  socket.emit("message", userWithMessages.messages || []);
  onlineUser.add(user?._id?.toString());
  io.emit("onlineUser", Array.from(onlineUser));
  // MESSAGE PAGE
  socket.on("message-page", async (userId) => {
    const userDetails = await db.User.findById(userId).select("-password");
    const payload = {
      _id: userDetails?._id,
      accountName: userDetails?.accountName,
      profilePic: userDetails?.profilePic,
      profilePicFileId: userDetails?.profilePicFileId,
      profilePicBucketName: userDetails?.profilePicBucketName,
      location: userDetails?.location,
      onlineUser: onlineUser?.has(userId),
      products: userDetails?.products,
      blockedUser: userDetails?.blockedUser,
      blockedFromUser: userDetails?.blockedFromUser,
      email: userDetails?.email,
    };
    socket.emit("message-user", payload);
    // GET PREVIOUS MESSAGE -------------------
    const getConversationMessage = await db.ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    socket.emit("message", getConversationMessage?.messages || []);
  });
  // NEW MESSAGE ------------------------
  socket.on("new message", async (data) => {
    // console.log("I AM FROM front", data);
    let conversation = await db.ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });
    // if conversation is not available?
    if (!conversation) {
      const createConversation = await db.ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
      // Push conversation._id to both users' conversation arrays
      await db.User.findByIdAndUpdate(data.sender, {
        $addToSet: { conversation: conversation._id },
      });
      await db.User.findByIdAndUpdate(data.receiver, {
        $addToSet: { conversation: conversation._id },
      });
    }
    const message = await db.MessagingModel({
      text: data?.text,
      imageUrl: data?.imageUrl,
      imageFileId: data?.imageFileId,
      imageBucketName: data?.imageBucketName,
      videoUrl: data?.videoUrl,
      videoFileId: data?.videoFileId,
      videoBucketName: data?.videoBucketName,
      msgByUserId: data?.msgByUserId,
      accountName: data?.accountName,
    });
    const saveMessage = await message.save();
    await db.ConversationModel.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessage?._id },
      }
    );
    // Push message._id to both users' messages arrays
    await db.User.findByIdAndUpdate(data.sender, {
      $push: { messages: saveMessage._id },
    });
    await db.User.findByIdAndUpdate(data.receiver, {
      $push: { messages: saveMessage._id },
    });
    const getConversationMessage = await db.ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });
    io.to(data?.sender).emit(
      "message",
      getConversationMessage?.messages || []
    );
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );
    // send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);
    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });
  // SIDE BAR FOR MESSAGES
  socket.on("sidebar", async (currentUserId) => {
    const conversation = await getConversation(currentUserId);
    // You can emit here if you want:
    // socket.emit("conversation", conversation);
  });
  socket.on("seen", async (msgByUserId) => {
    let conversation = await db.ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });
    const conversationMsgId = conversation?.messages || [];
    await db.MessagingModel.updateMany(
      { _id: { $in: conversationMsgId }, msgByUserId: msgByUserId },
      { $set: { seen: true } }
    );
    // SEEN send conversation
    const conversationSender = await getConversation(user?._id?.toString());
    const conversationReceiver = await getConversation(msgByUserId);
    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);
  });
  // CHATROOM JUST CHATTING -----------------------------------------------------------
  socket.on("ChatRoom-JustChatting", async (userId) => {
    // console.log("userID INSIDE CHATROOM", userId);
    const userDetails = await db.User.findById(userId).select("-password");
    const payload = {
      _id: userDetails?._id,
      accountName: userDetails?.accountName,
      profilePic: userDetails?.profilePic,
      location: userDetails?.location,
      onlineUser: onlineUser?.has(userId),
      blockedUser: userDetails?.blockedUser,
      blockedFromUser: userDetails?.blockedFromUser,
      email: userDetails?.email,
    };
    socket.emit("userDetails-chatroom-justChatting", payload);
    inChatRoomJustChatting.add(user?._id.toString());
    io.emit("inChatRoom-JustChatting", Array.from(inChatRoomJustChatting));
  });

  // TOGGLE RESPONDING -----------------------------------------------------------
  socket.on("toggle-responding", async (quest) => {

    const newStatus = quest.isOpening ? "responding" : "received-msg";
    const update = {
      $set: {
        questionStatus: newStatus,
        responding: quest.isOpening ? quest.userId : "",
        updatedAt: new Date(),
      },
    };
    try {
      const doc = await db.Question.findOneAndUpdate(
        { _id: quest._id },
        update,
        { returnDocument: "after" }
      );
      if (!doc) {
        console.warn("[SERVER] No doc found for _id", quest._id);
        return;
      }
      const questReturn = {
        _id: doc._id,
        body: doc.body,
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        phoneNumber: doc.phoneNumber,
        questionStatus: doc.questionStatus,
        response: doc.response,
        seen: doc.seen,
        responding: doc.responding,
      };
  
      io.emit("toggleResponse", questReturn);
    } catch (err) {
      console.error("[SERVER] error in toggle-responding handler:", err);
    }
  });

  // New socket: when closing, go back to "sent-response" instead of "received-msg"
  socket.on("toggle-responding-sent", async (quest) => {

    // Only change below: use 'sent-response' when isOpening is false
    const newStatus = quest.isOpening ? "responding" : "sent-response";
    const update = {
      $set: {
        questionStatus: newStatus,
        responding: quest.isOpening ? quest.userId : "",
        updatedAt: new Date(),
      },
    };
    try {
      const doc = await db.Question.findOneAndUpdate(
        { _id: quest._id },
        update,
        { returnDocument: "after" }
      );
      if (!doc) {
        console.warn("[SERVER] No doc found for _id", quest._id);
        return;
      }
      const questReturn = {
        _id: doc._id,
        body: doc.body,
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        phoneNumber: doc.phoneNumber,
        questionStatus: doc.questionStatus,
        response: doc.response,
        seen: doc.seen,
        responding: doc.responding,
      };
   
      // You can emit a separate event name if you want,
      // or reuse "toggleResponse" so the client code path stays the same.
      io.emit("toggleResponse", questReturn);
    } catch (err) {
      console.error("[SERVER] error in toggle-responding-sent handler:", err);
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    inChatRoomJustChatting.delete(user?._id?.toString());
    // console.log('disconnected user', socket.id)
  });
});

export { app, server };