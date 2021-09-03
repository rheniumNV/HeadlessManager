const _ = require("lodash");

require("dotenv").config();
const {
  HEADLESS_PATH,
  CONTROLLER_USERNAME,
  CONTROLLER_PASSWORD,
  ALLOWED_USER_LIST,
} = process.env;
const allowedUserIdList = _.split(ALLOWED_USER_LIST, ",");

const { HeadlessInterface } = require("neosjs-headless-interface");
const headlessInterface = new HeadlessInterface(HEADLESS_PATH);

const Neos = require("@bombitmanbomb/neosjs");
const neos = new Neos();
neos.Login(CONTROLLER_USERNAME, CONTROLLER_PASSWORD);

neos.on("messageReceived", async (message) => {
  if (_.includes(allowedUserIdList, message.SenderId)) {
    const result = await headlessInterface.RunCommand(message.Content);
    neos.SendTextMessage(message.SenderId, result);
  } else {
    neos.SendTextMessage(message.SenderId, "Permission denied");
  }
});

neos.on("friendAdded", (friend) => {
  if (friend.FriendStatus == "Requested") {
    neos.AddFriend(friend);
  }
  console.log(friend);
});
