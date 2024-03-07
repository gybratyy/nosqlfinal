const User = require('../models/userModel');
const Conversation = require('../models/conversationModel');
const ObjectId = require('mongodb').ObjectId; 
const Message = require('../models/messagemodel');


exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.locals.data = { users };
        next();
    } catch (err) {
        console.log(err, err.message);
    }
}


exports.login = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
        }

        req.session.user = user;
        console.log(req.session.user);
        res.redirect('/home');

    } catch (err) {
        console.log(err, err.message);
    }
}


exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}


exports.getAllConversationsForUser = async (req,res,next) => {
    try {
        const user = req.session.user;
        const users = await User.find();
        const conversations = await Conversation.find({ participants: { $in: [user._id] } });
        res.locals.data = { conversations,users };
        console.log(conversations);
        next()
    } catch (err) {
        console.log(err, err.message);
    }
}


exports.getConversation = async (req, res, next) => {
    try {
      const conversationId = req.body.conversationid; 
      const fetchedconversation = await Conversation.findById(conversationId); 
      const messages = await Message.find({ conversationId });
      const participants = await User.find({ _id: { $in: fetchedconversation.participants } });

      res.locals.data = { conversation:fetchedconversation, messages:messages, participants:participants }; 
      next();
    } catch (err) {
      console.log(err, err.message);
    }
  };
  
exports.createChat = async (req, res) => {
    try {
        const { participants, chatname } = req.body;
        const newConversation = new Conversation({ name: chatname, participants: participants });   
        await newConversation.save();    
        res.redirect('/home');
    } catch (err) {
        console.log(err, err.message);
    }
}




exports.sendMessage = async (req,res) => {
    try{
        const { conversationId, sender, content } = req.body;
        const newMessage = new Message({conversationId,sender, content});
        await newMessage.save();
        const messages = await Message.find({ conversationId });
        const conversation = await Conversation.findById(conversationId);
        const participants = await User.find({ _id: { $in: conversation.participants } });
        res.render('conversation', { user: req.session.user, conversation: conversation, messages:messages , participants: participants });
    }
    catch(err){
        console.log(err, err.message);
    }
}


exports.createConversation = async (req) => {
    try{
        const { participants } = req.body;
        const newConversation = new Conversation({participants});
        await newConversation.save();
    }
    catch(err){
        console.log(err, err.message);
    }
}

exports.debug = (req,res) => {
    res.json(res.locals.data);
}