const express = require('express');
const nodeCache = require('node-cache');
const axios = require('axios').default;

const router = express.Router();

const secondsIn8Hours = 8 * 60 * 60;
const cache = new nodeCache({ stdTTL: secondsIn8Hours });

router.use(async (req, res, next) => {
    try {
        if (cache.has("activities")) {
            req.activities = cache.get("activities");
        } else {
            const url = "http://localhost:8080/api/activities";
            const response = await axios.get(url);

            if (response.status === 200) {
                cache.set("activities", response.data.activities);
                req.activities = cache.get("activities");
            }
        }

        if (cache.has("subjects")) {
            req.subjects = cache.get("subjects");
        } else {
            const url = "http://localhost:8080/api/subjects";
            const response = await axios.get(url);

            if (response.status === 200) {
                cache.set("subjects", response.data.subjects);
                req.subjects = cache.get("subjects");
            }
        }

        next();
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;