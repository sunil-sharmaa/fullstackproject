const express = require("express");
const router = express.Router();
const verifytoken = require('../middleware/verifytoken')
const { body, validationResult } = require("express-validator")
const Note = require('../models/note');
const User = require("../models/user");


router.post('/post', verifytoken,
    [
        body('title', "title must have 5 chrecter").isLength({ min: 5 }),
        body('description', "description must have 10 chrecter").isLength({ min: 10 }),
    ],
    async (req, res) => {
        const { title, description, tag } = req.body;

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(404).json({ error: errors.array() })
            }

            const data = {
                user: req.user.id,
                title: title,
                description: description,
                tag: tag
            }

            const entry = await new Note(data)
            const savedata = await entry.save()

            res.status(200).json(savedata)
        }
        catch (err) {
            res.status(404).json(err)
        }

    }
)

router.get('/get', verifytoken, async (req, res) => {

    try {

        let data = await Note.find({user:req.user.id})
        if (!data) {
            res.status(404).json({ error: "please first make some notes" })
        }
        res.status(200).json(data)
    }

    catch (error) {
        res.status(404).json({ error: "data not found" })
    }
})
//ynha :_id is wrong and :id is right
router.delete('/delete/:id', verifytoken, async (req, res) => {

    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "data is not find in database" })
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(404).json({ error: "you can not delete this data" })
        }
        const deletedata = await Note.findByIdAndDelete(req.params.id)
        res.status(200).json("data is successfully deleted")

    }
    catch (error) {
        res.status(404).json({ error: "data is not available" })
    }
})

router.put('/update/:id', verifytoken, async (req, res) => {
    const { title, description, tag } = req.body;

    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'data is not find' })
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(404).json({ error: 'user not found' })
        }

        const updatedata = {}
        if (title)  {updatedata.title = title} 
        if (description) { updatedata.description = description }
        if (tag) { updatedata.tag = tag }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: updatedata })
        res.status(200).json(note)
    }
    catch (error) {
        res.status(404).json(error)
    }

})

module.exports = router