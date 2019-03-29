const express = require("express");
const router = express.Router();
const md5 = require("md5");
const websockets = require("../sockets/websockets.js");
const User = require("../database/Schema/userSchema.js");

/**
 * create file and send 200 status
 */
router.post("/:file", function(req, res) {
  if (req.user) {
    User.findById(req.user._id, (err, user) => {
      user.ownFiles
        .push({
          name: req.params.file,
          nameHash: md5(req.params.file + user.id),
          ownerId: user.id,
          ownerName: user.name.givenName,
          allowedPeople: []
        })
        .save()

        .then(user => {
          websockets.createFile(
            user.ownFiles[user.ownFiles.length - 1].nameHash
          );

          res.sendStatus(200);
        });
    });
  } else {
    res.sendStatus(401);
  }
});

/**
 * delete file hendler and send 200 status
 */
router.delete("/:file", function(req, res) {
  if (req.user) {
    User.findById(req.user._id, (err, user) => {
      websockets
        .deleteFile(
          user.ownFiles[
            user.ownFiles.findIndex(
              (element, index, array) => element.nameHash === req.params.file
            )
          ].nameHash
        )

        .then(err => {
          if (!err) {
            user.ownFiles
              .splice(
                user.ownFiles.findIndex(
                  (element, index, array) =>
                    element.nameHash === req.params.file
                ),
                1
              )
              .save();
            res.sendStatus(200);
          } else {
            res.sendStatus(500);
          }
        });
    });
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
