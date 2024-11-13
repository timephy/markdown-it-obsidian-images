'use strict'

const Plugin = require('markdown-it-regexp')
const extend = require('extend')
const sanitize = require('sanitize-filename')

module.exports = (options) => {

    const defaults = {
        baseURL: '/',
        relativeBaseURL: './',
        makeAllLinksAbsolute: false,
        uriSuffix: '',
        htmlAttributes: {
        },
        postProcessPageName: (pageName) => {
            pageName = pageName.trim()
            pageName = pageName.split('/').map(sanitize).join('/')
            return pageName
        },
        postProcessLabel: (label) => {
            label = label.trim().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
            return label
        }
    }

    options = extend(true, defaults, options)

    function isAbsolute(pageName) {
        return options.makeAllLinksAbsolute || pageName.charCodeAt(0) === 0x2F/* / */
    }

    function removeInitialSlashes(str) {
        return str.replace(/^\/+/g, '')
    }

    return Plugin(
        /!\[\[([^|\]\n]+)(\|([^\]\n]+))?\]\]/,
        (match, utils) => {
            let width = ''
            let alt = ''
            let pageName = ''
            let href = ''
            let htmlAttrs = []
            let htmlAttrsString = ''
            pageName = match[1]
            // `![[file.png|afterBar]]`
            let afterBar = match[3] || ''

            const afterBarParts = afterBar.split('|')
            if (afterBarParts.length === 0) {
                // nothing to do
            } else if (afterBarParts.length === 1) {
                alt = afterBarParts[0]
                if (!isNaN(afterBarParts[0].charAt(0))) {
                    width = afterBarParts[0]
                }
            } else if (afterBarParts.length === 2) {
                alt = afterBarParts[0]
                if (isNaN(afterBarParts[1].charAt(0))) {
                    throw "Image has two `|` characters, but the third part is not a number. This is not allowed."
                }
                width = afterBarParts[1]
            } else {
                throw "Image has more than two `|` characters"
            }

            width = options.postProcessLabel(width)
            pageName = options.postProcessPageName(pageName)

            // make sure none of the values are empty
            if (!pageName) {
                return match.input
            }

            if (isAbsolute(pageName)) {
                pageName = removeInitialSlashes(pageName)
                href = options.baseURL + pageName + options.uriSuffix
            }
            else {
                href = options.relativeBaseURL + pageName + options.uriSuffix
            }
            href = utils.escape(href)

            htmlAttrs.push(`src="${href}"`)
            if (width) htmlAttrs.push(`width="${width}"`)
            if (alt) htmlAttrs.push(`alt="${alt}"`)
            for (let attrName in options.htmlAttributes) {
                const attrValue = options.htmlAttributes[attrName]
                htmlAttrs.push(`${attrName}="${attrValue}"`)
            }
            htmlAttrsString = htmlAttrs.join(' ')

            return `<img ${htmlAttrsString} />`
        }
    )
}
