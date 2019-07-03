
module.exports = async function (userId, guild) {
    let member;
    try {
        member = await guild.fetchMember(userId);
    }catch(e){
        throw("Failed to fetch member: " + e);
    }

    let username;

    if (member.nickname) {
        username = member.nickname;
    }else{
        username = member.user.tag;
    }

    return username;
};