const User = require("../models/user")
const Group = require("../models/group")
const GroupUser = require("../models/groupUser")
const { Op } = require("sequelize");


exports.addMember = async (req, res) => {
    try {
        const email = req.body.email
        const groupId = req.body.groupId
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            return res.status(404).json({ message: "Kindly register your email to proceed", success: "false" })
        }
        const group = await Group.findOne({ where: { id: groupId } })
        const addmember = await group.addUser(user, { through: { isAdmin: false } })
        res.status(200).json({ message: "Member has been added to the Chatsy Group! ", success: "true" })
    } catch (err) {
        res.status(500).json({ message: "Something went Wrong!" })
    }
}
exports.removeUser = async (req, res) => {
    try {
        const remove_user_id = req.body.userId;
        const groupId = req.body.groupId;
        const user = await User.findByPk(remove_user_id);
        if (!user) {
            return res.status(403).json({ message: "No User Found!" });
        }
        const admin = await GroupUser.findOne({
            where: {
                [Op.and]: [{ userId: req.user.id },{ isAdmin: true },{ groupId: groupId }]}});
        if (!admin) {
            return res.status(403).json({ message: "Permission Denied! Not an admin!" });
        } else {
            const remove_member = await GroupUser.findOne({
                where: { [Op.and]: [{ userId: remove_user_id }, { groupId: groupId }] },
            });
            await remove_member.destroy();
            res.status(200).json({ message: "Success!",success:"true" });
        }
    } catch (error) {
        res.status(500).json({ message: "remove member failed ", success: "false" })
    }
}
exports.getAllMembers = async (req, res) => {
    try {
        const groupId = +req.params.groupId;
        const members = await GroupUser.findAll({ where: { groupId } });
        const memberarray = [];
        for (let i = 0; i < members.length; i++) {
            const user = await User.findByPk(members[i].userId);
            if (user) {
                const fetch_user = {...user,isAdmin: members[i].isAdmin,}; 
                memberarray.push(fetch_user)
            }}
        res.status(200).json({ members: memberarray, success: "true" });
    } catch (error) {
        res.status(500).json({ message: "Something went Wrong! ", success: "false" })
    }
}
exports.makeAdmin = async (req, res) => {
    try {
        let groupId = req.body.groupId;
        let make_admin = req.body.userId;
        let user = await User.findByPk(make_admin);
        if (!user) {
            return res.status(403).json({ message: "No user Found!" });
        }
        const admin = await GroupUser.findOne({
            where: {
                [Op.and]: [{ userId: req.user.id },{ isAdmin: true }, { groupId: groupId }]}});
        if (!admin) {
            return res.status(403).json({ message: "Permission Denied! Not an admin!" });
        }
        let update_member = await GroupUser.findOne({
            where: {[Op.and]: [{ userId: make_admin }, { groupId: groupId }]}});
        await update_member.update({ isAdmin: true });
        res.status(200).json({ message: "Success!" });
    } catch (error) {
        res.status(500).json({ message: "Something went Wrong! ", success: "false" })
    }
}

exports.removeAdmin = async (req, res) => {
    try {
        let remove_admin = req.body.userId;
        let groupId = req.body.groupId;
        let user = await User.findByPk(remove_admin);
        if (!user) {
            res.status(403).json({ message: "No user Found!" });
        }
        const admin = await GroupUser.findOne({
            where: {
                [Op.and]: [{ userId: req.user.id },{ isAdmin: true }, { groupId: groupId }]}});
        if (!admin) {
            return res.status(403).json({ message: "Permission Denied! Not an admin!" });
        }
        let update_members = await GroupUser.findOne({
            where: { [Op.and]: [{ userId: remove_admin }, { groupId: groupId }]}});
        await update_members.update({ isAdmin: false });
        res.status(200).json({ message: "Success!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!", success: "false" })
    }
}
exports.getAll = async(req,res)=>{
    try{
    const user = await User.findAll();
    res.send(user)
    // console.log(user)
    }
    catch(err){
        console.log(err)
    }
}