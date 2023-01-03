const express = require('express');
const router = express.Router();
const nodeCache = require('node-cache');
const axios = require('axios').default;

const secondsIn8Hours = 8 * 60 * 60;
const cache = new nodeCache({ stdTTL: secondsIn8Hours });

router.use(async (req, res, next) => {
    try {
        if (cache.has("activities")) {
            req.cache = cache.get("activities");
        } else {
            const url = "http://localhost:8080/api/activities";
            const response = await axios.get(url);

            if (response.status === 200) {
                cache.set("activities", response.data);
                req.cache = cache.get("activities");
            }
        }

    } catch (e) {
        console.error(e);
    }
});

module.exports = router;