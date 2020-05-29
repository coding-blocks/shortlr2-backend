import { Router } from 'express'
import Raven from 'raven'
import { findGroupByPrefix, findUrlsInGroup } from '../../controllers/groups'
import {
  createUrl,
  findUrlByCodeInt,
  findUrlByShortcode,
} from '../../controllers/urls'
import { optsFromGroupedShortcode } from '../../utils/shortener'

export const route = Router()

/**
 * @api  {get} api/urls/:shortCode Details of URL not part of a group
 * @apiVersion 0.1.0
 * @apiGroup Short URL Operations
 * @apiName Get shorturl info
 * @apiPermission BearerToken
 * @apiHeader {String} Authorization bearerToken token from oneAuth
 * @apiDescription This endpoint returns all the data about a short code passed as param. If a suitable
 * shortcode is not matched, then the application checks if a group with the passed shortCode exists
 *
 * @apiParam {String} shortCode The short url the detail of which is required
 *
 * @apiSuccess (Short Url Details) {Object}     Object              containing all the details of the url shortcode
 * @apiSuccess (Short Url Details) {Number}     Object.id           unique internal id of the url shortcode
 * @apiSuccess (Short Url Details) {Number}     Object.code         string containing a big integer code
 * @apiSuccess (Short Url Details) {Number}     Object.codeStr      string received by the application to process shortcode
 * @apiSuccess (Short Url Details) {Number}     Object.codeActual   the actual short code, after removing group name
 * @apiSuccess (Short Url Details) {String}     Object.longUrl      the url which the short code points to
 * @apiSuccess (Short Url Details) {Number}     Object.hits         number of times the passed url is opened
 * @apiSuccess (Short Url Details) {Boolean}    Object.private      true if the url is a private url, false if it is not
 * @apiSuccess (Short Url Details) {Number}     Object.ownerId      the id of the user who created the shortcode
 * @apiSuccess (Short Url Details) {String}     Object.groupId      the group to which url belongs, null if no group present
 * @apiSuccess (Short Url Details) {Date}       Object.createdAt    data when the shortcode was created
 * @apiSuccess (Short Url Details) {Date}       Object.updatedAt    data when the shortcode was updated
 * @apiSuccess (Short Url Details) {Date}       Object.deletedAt    data when the shortcode was deleted, by default null
 *
 * @apiErrorExample {application/json} Error-Response:
 *  {"error":"Could not find shortcode."}
 * @apiExample {json} Example Response:
 * {
 *   "id":1,
 *   "code":"79542000",
 *   "codeStr":"4lRcW",
 *   "codeActual":"4lRcW",
 *   "longUrl":"https://github.com/yashkumarverma/?utm_source=Testing&utm_medium=manual&utm_campaign=testing_campaign",
 *   "hits":0,
 *   "private":false,
 *   "ownerId":24XXXX,
 *   "groupId":null,
 *   "createdAt":"2020-05-29T08:33:07.224Z",
 *   "updatedAt":"2020-05-29T08:33:07.224Z",
 *   "deletedAt":null
 * }
 *
 */
route.get('/:code', async (req, res) => {
  try {
    const url = await findUrlByShortcode(req.params.code)

    res.json(url)
  } catch (err) {
    Raven.captureException(err)
    res.status(404).json({
      error: err.message,
    })
  }
})

/**
 * @api  {get} api/urls/:group List all urls of Group
 * @apiVersion 0.1.0
 * @apiGroup Short URL Operations
 * @apiName Get details of all short-codes belonging to a group
 * @apiPermission BearerToken
 * @apiHeader {String} Authorization bearerToken token from oneAuth
 * @apiDescription This endpoint returns an array containing details of all short-codes belonging to a group
 *
 * @apiParam {String}   group     the name of the group whose details are required
 *
 * @apiSuccess (Short Url Details) {Object[]}   Array                     array of objects containing details of the member shortcodes
 * @apiSuccess (Short Url Details) {Object}     Array.Object              containing all the details of the url shortcode
 * @apiSuccess (Short Url Details) {Number}     Array.Object.id           unique internal id of the url shortcode
 * @apiSuccess (Short Url Details) {Number}     Array.Object.code         string containing a big integer code
 * @apiSuccess (Short Url Details) {Number}     Array.Object.codeStr      string received by the application to process shortcode
 * @apiSuccess (Short Url Details) {Number}     Array.Object.codeActual   the actual short code, after removing group name
 * @apiSuccess (Short Url Details) {String}     Array.Object.longUrl      the url which the short code points to
 * @apiSuccess (Short Url Details) {Number}     Array.Object.hits         number of times the passed url is opened
 * @apiSuccess (Short Url Details) {Boolean}    Array.Object.private      true if the url is a private url, false if it is not
 * @apiSuccess (Short Url Details) {Number}     Array.Object.ownerId      the id of the user who created the shortcode
 * @apiSuccess (Short Url Details) {String}     Array.Object.groupId      the group to which url belongs, null if no group present
 * @apiSuccess (Short Url Details) {Date}       Array.Object.createdAt    data when the shortcode was created
 * @apiSuccess (Short Url Details) {Date}       Array.Object.updatedAt    data when the shortcode was updated
 * @apiSuccess (Short Url Details) {Date}       Array.Object.deletedAt    data when the shortcode was deleted, by default null
 *
 * @apiErrorExample {application/json} Error-Response:
 *  {"error":"Could not find shortcode."}
 *
 * @apiExample {json} Listing all urls of a group
 * [
 *   {
 *      "id":13,
 *      "code":"469276379205632",
 *      "codeStr":"1github00",
 *      "codeActual":"boss/github",
 *      "longUrl":"https://github.com/coding-blocks/boss",
 *      "hits":0,
 *      "private":false,
 *      "ownerId":24XXXX,
 *      "groupId":1,
 *      "createdAt":"2020-05-29T13:16:21.447Z",
 *      "updatedAt":"2020-05-29T13:16:21.447Z",
 *      "deletedAt":null
 *   },
 *   {
 *      "id":14,
 *      "code":"539351099603456",
 *      "codeStr":"1website0",
 *      "codeActual":"boss/website",
 *      "longUrl":"https://boss.codingblocks.com/",
 *      "hits":0,
 *      "private":false,
 *      "ownerId":24XXXX,
 *      "groupId":1,
 *      "createdAt":"2020-05-29T14:19:46.611Z",
 *      "updatedAt":"2020-05-29T14:19:46.611Z",
 *      "deletedAt":null
 *   }
 * ]
 *
 */
route.get('/:group', async (req, res) => {
  try {
    const urls = await findUrlsInGroup(req.params.group)

    res.json(urls)
  } catch (err) {
    Raven.captureException(err)
    res.status(404).json({
      error: err.message,
    })
  }
})

/**
 * @api  {get} api/urls/:group/:shortCode Details of URL part of a group
 * @apiVersion 0.1.0
 * @apiGroup Short URL Operations
 * @apiName Get info of shortcode belonging to a group
 * @apiPermission BearerToken
 * @apiHeader {String} Authorization bearerToken token from oneAuth
 * @apiDescription This endpoint returns data of short-url belonging to a group
 *
 * @apiParam {String}   group     the name of the group to which the short-url belongs
 * @apiParam {String}   shortCode the shortcode whose details are required
 *
 * @apiSuccess (Short Url Details) {Object}     Object              containing all the details of the url shortcode
 * @apiSuccess (Short Url Details) {Number}     Object.id           unique internal id of the url shortcode
 * @apiSuccess (Short Url Details) {Number}     Object.code         string containing a big integer code
 * @apiSuccess (Short Url Details) {Number}     Object.codeStr      string received by the application to process shortcode
 * @apiSuccess (Short Url Details) {Number}     Object.codeActual   the actual short code, after removing group name
 * @apiSuccess (Short Url Details) {String}     Object.longUrl      the url which the short code points to
 * @apiSuccess (Short Url Details) {Number}     Object.hits         number of times the passed url is opened
 * @apiSuccess (Short Url Details) {Boolean}    Object.private      true if the url is a private url, false if it is not
 * @apiSuccess (Short Url Details) {Number}     Object.ownerId      the id of the user who created the shortcode
 * @apiSuccess (Short Url Details) {String}     Object.groupId      the group to which url belongs, null if no group present
 * @apiSuccess (Short Url Details) {Date}       Object.createdAt    data when the shortcode was created
 * @apiSuccess (Short Url Details) {Date}       Object.updatedAt    data when the shortcode was updated
 * @apiSuccess (Short Url Details) {Date}       Object.deletedAt    data when the shortcode was deleted, by default null
 *
 * @apiErrorExample {application/json} Error-Response:
 *  {"error":"Could not find shortcode."}
 *
 * @apiExample {json} When requesting data of short-code:github of group:boss
 * {
 *   "id":13,
 *   "code":"469276379205632",
 *   "codeStr":"1github00",
 *   "codeActual":"boss/github",
 *   "longUrl":"https://github.com/coding-blocks/boss",
 *   "hits":250,
 *   "private":false,
 *   "ownerId":24XXXX,
 *   "groupId":1,
 *   "updatedAt":"2020-05-29T13:16:21.447Z",
 *   "createdAt":"2020-05-29T13:16:21.447Z",
 *   "deletedAt":null
 * }
 *
 */
route.get('/:group/:code', async (req, res) => {
  try {
    const group = await findGroupByPrefix(req.params.group)
    const opts = optsFromGroupedShortcode(group, req.params.code)
    const url = await findUrlByCodeInt(opts.codeInt)

    res.json(url)
  } catch (err) {
    Raven.captureException(err)
    res.status(404).json({
      error: err.message,
    })
  }
})

/**
 * @api  {post} api/urls/ Create New Short URL
 * @apiVersion 0.1.0
 * @apiGroup Short URL Operations
 * @apiName Generate Short URL
 * @apiPermission BearerToken
 * @apiHeader {String} Authorization bearerToken token from oneAuth
 * @apiDescription This endpoint is used to create short URLs.
 *
 * @apiParam {String}   longUrl     the long url to be shortened
 * @apiParam {String}   [shortCode] the custom shortcode required for the passed url. To create groups,
 * use the format <groupName>/<shortCode>
 * @apiParam {Boolean}  [private]  true if user should login to access the link, false for not
 *
 * @apiSuccess (Short Url Details) {Object}     Object              containing all the details of the url shortcode
 * @apiSuccess (Short Url Details) {Number}     Object.id           unique internal id of the url shortcode
 * @apiSuccess (Short Url Details) {Number}     Object.code         string containing a big integer code
 * @apiSuccess (Short Url Details) {Number}     Object.codeStr      string received by the application to process shortcode
 * @apiSuccess (Short Url Details) {Number}     Object.codeActual   the actual short code, after removing group name
 * @apiSuccess (Short Url Details) {String}     Object.longUrl      the url which the short code points to
 * @apiSuccess (Short Url Details) {Number}     Object.hits         number of times the passed url is opened
 * @apiSuccess (Short Url Details) {Boolean}    Object.private      true if the url is a private url, false if it is not
 * @apiSuccess (Short Url Details) {Number}     Object.ownerId      the id of the user who created the shortcode
 * @apiSuccess (Short Url Details) {String}     Object.groupId      the group to which url belongs, null if no group present
 * @apiSuccess (Short Url Details) {Date}       Object.createdAt    data when the shortcode was created
 * @apiSuccess (Short Url Details) {Date}       Object.updatedAt    data when the shortcode was updated
 * @apiSuccess (Short Url Details) {Date}       Object.deletedAt    data when the shortcode was deleted, by default null
 *
 * @apiErrorExample {application/json} Error-Response:
 *  {"error":"Could not find shortcode."}
 *
 * @apiExample {json} When creating entry not belonging to group
 * {
 *   "id":1,
 *   "code":"79542000",
 *   "codeStr":"4lRcW",
 *   "codeActual":"4lRcW",
 *   "longUrl":"https://github.com/yashkumarverma/?utm_source=Testing&utm_medium=manual&utm_campaign=testing_campaign",
 *   "hits":21,
 *   "private":false,
 *   "ownerId":24XXXX,
 *   "groupId":null,
 *   "createdAt":"2020-05-29T08:33:07.224Z",
 *   "updatedAt":"2020-05-29T08:33:07.224Z",
 *   "deletedAt":null
 * }
 *
 * @apiExample {json} When creating entry belonging to group
 * {
 *   "id":13,
 *   "code":"469276379205632",
 *   "codeStr":"1github00",
 *   "codeActual":"boss/github",
 *   "longUrl":"https://github.com/coding-blocks/boss",
 *   "hits":250,
 *   "private":false,
 *   "ownerId":24XXXX,
 *   "groupId":1,
 *   "createdAt":"2020-05-29T13:16:21.447Z",
 *   "updatedAt":"2020-05-29T13:16:21.447Z",
 *   "deletedAt":null
 * }
 *
 */
route.post('/', async (req, res) => {
  try {
    const url = await createUrl(
      {
        longUrl: req.body.longUrl,
        shortCode: req.body.shortCode,
      },
      req.user,
    )
    res.json(url)
  } catch (err) {
    Raven.captureException(err)
    res.status(500).json({
      error: err.message,
    })
  }
})
