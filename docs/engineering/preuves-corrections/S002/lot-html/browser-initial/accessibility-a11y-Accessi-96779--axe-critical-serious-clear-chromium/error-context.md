# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility/a11y.spec.js >> Accessibility smoke (EN) >> Home page — axe critical/serious clear
- Location: tests/e2e/accessibility/a11y.spec.js:15:7

# Error details

```
Error: [
  {
    "id": "color-contrast",
    "impact": "serious",
    "tags": [
      "cat.color",
      "wcag2aa",
      "wcag143",
      "TTv5",
      "TT13.c",
      "EN-301-549",
      "EN-9.1.4.3",
      "ACT",
      "RGAAv4",
      "RGAA-3.2.1"
    ],
    "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
    "help": "Elements must meet minimum color contrast ratio thresholds",
    "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright",
    "nodes": [
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#68a1ca",
              "bgColor": "#eaf2f7",
              "contrastRatio": 2.45,
              "fontSize": "15.0pt (20px)",
              "fontWeight": "bold",
              "messageKey": null,
              "expectedContrastRatio": "3:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-xy3e21\">",
                "target": [
                  ".css-xy3e21"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 2.45 (foreground color: #68a1ca, background color: #eaf2f7, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<h5 class=\"MuiTypography-root MuiTypography-h5 css-nvh9ff\">Castability Models</h5>",
        "target": [
          ".css-nvh9ff"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 2.45 (foreground color: #68a1ca, background color: #eaf2f7, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#90949b",
              "bgColor": "#eaf2f7",
              "contrastRatio": 2.68,
              "fontSize": "10.5pt (14px)",
              "fontWeight": "normal",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-xy3e21\">",
                "target": [
                  ".css-xy3e21"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 2.68 (foreground color: #90949b, background color: #eaf2f7, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<p class=\"MuiTypography-root MuiTypography-body2 css-ny9qqk\">Default estimates and explicit exact-model limits</p>",
        "target": [
          ".css-xy3e21 > .css-ny9qqk.MuiTypography-body2"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 2.68 (foreground color: #90949b, background color: #eaf2f7, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#c8ddce",
              "bgColor": "#f3f3ed",
              "contrastRatio": 1.28,
              "fontSize": "15.0pt (20px)",
              "fontWeight": "bold",
              "messageKey": null,
              "expectedContrastRatio": "3:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-19ro6sy\">",
                "target": [
                  ".css-19ro6sy"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 1.28 (foreground color: #c8ddce, background color: #f3f3ed, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<h5 class=\"MuiTypography-root MuiTypography-h5 css-n91h3h\">Proven Land Targets</h5>",
        "target": [
          ".css-n91h3h"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 1.28 (foreground color: #c8ddce, background color: #f3f3ed, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#d7d7d3",
              "bgColor": "#f3f3ed",
              "contrastRatio": 1.29,
              "fontSize": "10.5pt (14px)",
              "fontWeight": "normal",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-19ro6sy\">",
                "target": [
                  ".css-19ro6sy"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 1.29 (foreground color: #d7d7d3, background color: #f3f3ed, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<p class=\"MuiTypography-root MuiTypography-body2 css-ny9qqk\">How many color sources you need to cast your spells on curve</p>",
        "target": [
          ".css-19ro6sy > .css-ny9qqk.MuiTypography-body2"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 1.29 (foreground color: #d7d7d3, background color: #f3f3ed, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#f5f1ed",
              "bgColor": "#f5f3ee",
              "contrastRatio": 1.01,
              "fontSize": "15.0pt (20px)",
              "fontWeight": "bold",
              "messageKey": null,
              "expectedContrastRatio": "3:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-1lqqve8\">",
                "target": [
                  ".css-1lqqve8"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 1.01 (foreground color: #f5f1ed, background color: #f5f3ee, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<h5 class=\"MuiTypography-root MuiTypography-h5 css-1uyyix8\">Smart Mulligan Advice</h5>",
        "target": [
          ".css-1uyyix8"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 1.01 (foreground color: #f5f1ed, background color: #f5f3ee, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#767980",
              "bgColor": "#fbfaf8",
              "contrastRatio": 4.17,
              "fontSize": "12.0pt (16px)",
              "fontWeight": "bold",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1yxdtzw\">",
                "target": [
                  ".css-1yxdtzw"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 4.17 (foreground color: #767980, background color: #fbfaf8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<h6 class=\"MuiTypography-root MuiTypography-h6 css-114o6ff\">Castability</h6>",
        "target": [
          ".css-1yxdtzw > .css-lu93mv.MuiCardContent-root > .css-1a9re40.MuiBox-root > .css-114o6ff"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 4.17 (foreground color: #767980, background color: #fbfaf8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#97979b",
              "bgColor": "#fbfaf8",
              "contrastRatio": 2.78,
              "fontSize": "10.5pt (14px)",
              "fontWeight": "normal",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1yxdtzw\">",
                "target": [
                  ".css-1yxdtzw"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 2.78 (foreground color: #97979b, background color: #fbfaf8, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<p class=\"MuiTypography-root MuiTypography-body2 css-kzregh\">Model-based <span class=\"MuiTypography-root MuiTypography-body1 css-wxjjo9\">cast probability</span>. The default estimate includes mana rocks and dorks; exact modes cover only their stated supported model.</p>",
        "target": [
          ".css-1yxdtzw > .css-lu93mv.MuiCardContent-root > .css-kzregh.MuiTypography-body2"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 2.78 (foreground color: #97979b, background color: #fbfaf8, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#97979b",
              "bgColor": "#fbfaf8",
              "contrastRatio": 2.78,
              "fontSize": "12.0pt (16px)",
              "fontWeight": "normal",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1yxdtzw\">",
                "target": [
                  ".css-1yxdtzw"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 2.78 (foreground color: #97979b, background color: #fbfaf8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<span class=\"MuiTypography-root MuiTypography-body1 css-wxjjo9\">cast probability</span>",
        "target": [
          ".css-1yxdtzw > .css-lu93mv.MuiCardContent-root > .css-kzregh.MuiTypography-body2 > .css-wxjjo9.MuiTypography-body1"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 2.78 (foreground color: #97979b, background color: #fbfaf8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#d0d0ce",
              "bgColor": "#f7f5f1",
              "contrastRatio": 1.41,
              "fontSize": "12.0pt (16px)",
              "fontWeight": "bold",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1nqiq82\">",
                "target": [
                  ".css-1nqiq82"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 1.41 (foreground color: #d0d0ce, background color: #f7f5f1, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<h6 class=\"MuiTypography-root MuiTypography-h6 css-114o6ff\">Analysis Dashboard</h6>",
        "target": [
          ".css-1nqiq82 > .css-lu93mv.MuiCardContent-root > .css-1a9re40.MuiBox-root > .css-114o6ff"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 1.41 (foreground color: #d0d0ce, background color: #f7f5f1, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#dad8d7",
              "bgColor": "#f7f5f1",
              "contrastRatio": 1.3,
              "fontSize": "10.5pt (14px)",
              "fontWeight": "normal",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1nqiq82\">",
                "target": [
                  ".css-1nqiq82"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 1.3 (foreground color: #dad8d7, background color: #f7f5f1, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<p class=\"MuiTypography-root MuiTypography-body2 css-kzregh\">Visual breakdown of your spells by category, curve insights, and performance diagnostics at a glance.</p>",
        "target": [
          ".css-1nqiq82 > .css-lu93mv.MuiCardContent-root > .css-kzregh.MuiTypography-body2"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 1.3 (foreground color: #dad8d7, background color: #f7f5f1, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1"
      },
      {
        "any": [
          {
            "id": "color-contrast",
            "data": {
              "fgColor": "#f3f1ed",
              "bgColor": "#f5f3ee",
              "contrastRatio": 1.01,
              "fontSize": "12.0pt (16px)",
              "fontWeight": "bold",
              "messageKey": null,
              "expectedContrastRatio": "4.5:1"
            },
            "relatedNodes": [
              {
                "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1eoxf42\">",
                "target": [
                  ".css-1eoxf42"
                ]
              }
            ],
            "impact": "serious",
            "message": "Element has insufficient color contrast of 1.01 (foreground color: #f3f1ed, background color: #f5f3ee, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1"
          }
        ],
        "all": [],
        "none": [],
        "impact": "serious",
        "html": "<h6 class=\"MuiTypography-root MuiTypography-h6 css-114o6ff\">Mulligan Simulator</h6>",
        "target": [
          ".css-1eoxf42 > .css-lu93mv.MuiCardContent-root > .css-1a9re40.MuiBox-root > .css-114o6ff"
        ],
        "failureSummary": "Fix any of the following:\n  Element has insufficient color contrast of 1.01 (foreground color: #f3f1ed, background color: #f5f3ee, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1"
      }
    ]
  }
]

expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 408

- Array []
+ Array [
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#eaf2f7",
+               "contrastRatio": 2.45,
+               "expectedContrastRatio": "3:1",
+               "fgColor": "#68a1ca",
+               "fontSize": "15.0pt (20px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.45 (foreground color: #68a1ca, background color: #eaf2f7, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-xy3e21\">",
+                 "target": Array [
+                   ".css-xy3e21",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.45 (foreground color: #68a1ca, background color: #eaf2f7, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1",
+         "html": "<h5 class=\"MuiTypography-root MuiTypography-h5 css-nvh9ff\">Castability Models</h5>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-nvh9ff",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#eaf2f7",
+               "contrastRatio": 2.68,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#90949b",
+               "fontSize": "10.5pt (14px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.68 (foreground color: #90949b, background color: #eaf2f7, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-xy3e21\">",
+                 "target": Array [
+                   ".css-xy3e21",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.68 (foreground color: #90949b, background color: #eaf2f7, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"MuiTypography-root MuiTypography-body2 css-ny9qqk\">Default estimates and explicit exact-model limits</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-xy3e21 > .css-ny9qqk.MuiTypography-body2",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f3f3ed",
+               "contrastRatio": 1.28,
+               "expectedContrastRatio": "3:1",
+               "fgColor": "#c8ddce",
+               "fontSize": "15.0pt (20px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.28 (foreground color: #c8ddce, background color: #f3f3ed, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-19ro6sy\">",
+                 "target": Array [
+                   ".css-19ro6sy",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.28 (foreground color: #c8ddce, background color: #f3f3ed, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1",
+         "html": "<h5 class=\"MuiTypography-root MuiTypography-h5 css-n91h3h\">Proven Land Targets</h5>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-n91h3h",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f3f3ed",
+               "contrastRatio": 1.29,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#d7d7d3",
+               "fontSize": "10.5pt (14px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.29 (foreground color: #d7d7d3, background color: #f3f3ed, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-19ro6sy\">",
+                 "target": Array [
+                   ".css-19ro6sy",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.29 (foreground color: #d7d7d3, background color: #f3f3ed, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"MuiTypography-root MuiTypography-body2 css-ny9qqk\">How many color sources you need to cast your spells on curve</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-19ro6sy > .css-ny9qqk.MuiTypography-body2",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f5f3ee",
+               "contrastRatio": 1.01,
+               "expectedContrastRatio": "3:1",
+               "fgColor": "#f5f1ed",
+               "fontSize": "15.0pt (20px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.01 (foreground color: #f5f1ed, background color: #f5f3ee, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 css-1lqqve8\">",
+                 "target": Array [
+                   ".css-1lqqve8",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.01 (foreground color: #f5f1ed, background color: #f5f3ee, font size: 15.0pt (20px), font weight: bold). Expected contrast ratio of 3:1",
+         "html": "<h5 class=\"MuiTypography-root MuiTypography-h5 css-1uyyix8\">Smart Mulligan Advice</h5>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-1uyyix8",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fbfaf8",
+               "contrastRatio": 4.17,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#767980",
+               "fontSize": "12.0pt (16px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 4.17 (foreground color: #767980, background color: #fbfaf8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1yxdtzw\">",
+                 "target": Array [
+                   ".css-1yxdtzw",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 4.17 (foreground color: #767980, background color: #fbfaf8, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h6 class=\"MuiTypography-root MuiTypography-h6 css-114o6ff\">Castability</h6>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-1yxdtzw > .css-lu93mv.MuiCardContent-root > .css-1a9re40.MuiBox-root > .css-114o6ff",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fbfaf8",
+               "contrastRatio": 2.78,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#97979b",
+               "fontSize": "10.5pt (14px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.78 (foreground color: #97979b, background color: #fbfaf8, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1yxdtzw\">",
+                 "target": Array [
+                   ".css-1yxdtzw",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.78 (foreground color: #97979b, background color: #fbfaf8, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"MuiTypography-root MuiTypography-body2 css-kzregh\">Model-based <span class=\"MuiTypography-root MuiTypography-body1 css-wxjjo9\">cast probability</span>. The default estimate includes mana rocks and dorks; exact modes cover only their stated supported model.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-1yxdtzw > .css-lu93mv.MuiCardContent-root > .css-kzregh.MuiTypography-body2",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#fbfaf8",
+               "contrastRatio": 2.78,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#97979b",
+               "fontSize": "12.0pt (16px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 2.78 (foreground color: #97979b, background color: #fbfaf8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1yxdtzw\">",
+                 "target": Array [
+                   ".css-1yxdtzw",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 2.78 (foreground color: #97979b, background color: #fbfaf8, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<span class=\"MuiTypography-root MuiTypography-body1 css-wxjjo9\">cast probability</span>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-1yxdtzw > .css-lu93mv.MuiCardContent-root > .css-kzregh.MuiTypography-body2 > .css-wxjjo9.MuiTypography-body1",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f7f5f1",
+               "contrastRatio": 1.41,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#d0d0ce",
+               "fontSize": "12.0pt (16px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.41 (foreground color: #d0d0ce, background color: #f7f5f1, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1nqiq82\">",
+                 "target": Array [
+                   ".css-1nqiq82",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.41 (foreground color: #d0d0ce, background color: #f7f5f1, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h6 class=\"MuiTypography-root MuiTypography-h6 css-114o6ff\">Analysis Dashboard</h6>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-1nqiq82 > .css-lu93mv.MuiCardContent-root > .css-1a9re40.MuiBox-root > .css-114o6ff",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f7f5f1",
+               "contrastRatio": 1.3,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#dad8d7",
+               "fontSize": "10.5pt (14px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.3 (foreground color: #dad8d7, background color: #f7f5f1, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1nqiq82\">",
+                 "target": Array [
+                   ".css-1nqiq82",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.3 (foreground color: #dad8d7, background color: #f7f5f1, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<p class=\"MuiTypography-root MuiTypography-body2 css-kzregh\">Visual breakdown of your spells by category, curve insights, and performance diagnostics at a glance.</p>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-1nqiq82 > .css-lu93mv.MuiCardContent-root > .css-kzregh.MuiTypography-body2",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#f5f3ee",
+               "contrastRatio": 1.01,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#f3f1ed",
+               "fontSize": "12.0pt (16px)",
+               "fontWeight": "bold",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 1.01 (foreground color: #f3f1ed, background color: #f5f3ee, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<div class=\"MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation0 MuiCard-root css-1eoxf42\">",
+                 "target": Array [
+                   ".css-1eoxf42",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 1.01 (foreground color: #f3f1ed, background color: #f5f3ee, font size: 12.0pt (16px), font weight: bold). Expected contrast ratio of 4.5:1",
+         "html": "<h6 class=\"MuiTypography-root MuiTypography-h6 css-114o6ff\">Mulligan Simulator</h6>",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".css-1eoxf42 > .css-lu93mv.MuiCardContent-root > .css-1a9re40.MuiBox-root > .css-114o6ff",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to main content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - region "Feedback banner" [ref=e5]:
    - generic [ref=e7]:
      - alert [ref=e8]:
        - generic [ref=e10]:
          - generic [ref=e11]: Help us improve ManaTuner! (dismiss = hide banner; feedback stays in the footer)
          - link "Give feedback — opens Tally form in a new tab" [ref=e12] [cursor=pointer]:
            - /url: https://tally.so/r/A7KRkN
            - text: Give Feedback
      - button "Dismiss feedback banner" [ref=e16] [cursor=pointer]
  - banner [ref=e19]:
    - generic [ref=e20]:
      - link "ManaTuner - Back to home" [ref=e21] [cursor=pointer]:
        - /url: /
        - generic [ref=e22]:
          - generic [aria-hidden] [ref=e23]: 
          - generic [aria-hidden] [ref=e24]: 
          - generic [aria-hidden] [ref=e25]: 
          - generic [aria-hidden] [ref=e26]: 
          - generic [aria-hidden] [ref=e27]: 
        - generic [ref=e28]: ManaTuner
      - generic [ref=e29]:
        - link [ref=e30] [cursor=pointer]:
          - /url: /analyzer
        - link [ref=e34] [cursor=pointer]:
          - /url: /my-analyses
        - link [ref=e38] [cursor=pointer]:
          - /url: /library
        - button [ref=e42] [cursor=pointer]
      - link "Feedback" [ref=e49] [cursor=pointer]:
        - /url: https://tally.so/r/A7KRkN
      - link "View source code on GitHub" [ref=e53] [cursor=pointer]:
        - /url: https://github.com/gbordes77/manatuner
  - main [ref=e56]:
    - generic [ref=e57]:
      - generic:
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
        - generic:
          - generic [aria-hidden]: 
      - generic [ref=e59]:
        - generic [ref=e60]:
          - generic [aria-hidden] [ref=e61]: 
          - generic [aria-hidden] [ref=e62]: 
          - generic [aria-hidden] [ref=e63]: 
          - generic [aria-hidden] [ref=e64]: 
          - generic [aria-hidden] [ref=e65]: 
        - heading "Built to Count Rocks & Dorks — Not Just Lands" [level=1] [ref=e66]
        - heading [level=5] [ref=e67]:
          - text: Explore
          - strong [ref=e68]: mana probabilities
          - text: for supported cards and compare
          - strong [ref=e69]: mulligan strategies
          - text: .
        - paragraph [ref=e70]: Dorks = mana creatures. Rocks = mana artifacts. We count both.
        - generic [ref=e71]: Standard · Pioneer · Modern · Pauper · Commander · Limited — all supported
        - generic [ref=e72]:
          - generic [ref=e73]:
            - img "Blue mana" [ref=e74]: 
            - generic [ref=e75]: See The Real Odds
          - generic [ref=e76]:
            - img "Colorless mana" [ref=e77]: 
            - generic [ref=e78]: Rocks & Dorks Included
          - generic [ref=e79]:
            - img "Black mana" [ref=e80]: 
            - generic [ref=e81]: Smart Mulligan Advice
        - generic [ref=e82]:
          - button [ref=e84] [cursor=pointer]
          - button "Try an example deck" [ref=e89] [cursor=pointer]
        - generic [ref=e90]:
          - generic [ref=e91]: Sample result · Health Score 87% · Excellent
          - paragraph [ref=e92]: "Illustrative color access score: average turn-two access to required colors. This is not the percentage of spells cast on curve or a keep recommendation."
          - generic [ref=e93]:
            - generic [ref=e94]: Lightning Bolt 94%
            - generic [ref=e96]: Sheoldred 81%
            - generic [ref=e98]: Ramp counted
          - generic [ref=e100]: Built on Frank Karsten's manabase research · rocks & dorks included
        - paragraph [ref=e101]:
          - text: Free. No signup. Calculations and saved analyses stay in this browser. Card lookups and images use Scryfall; fonts use external providers.
          - link "See our privacy policy." [ref=e102] [cursor=pointer]:
            - /url: /privacy
        - paragraph [ref=e103]: 40-card pools, 60-card lists, 100-card singletons — one engine, same rigor.
      - generic [ref=e104]:
        - paragraph [ref=e107]: The math tells you what to play.The canon tells you why.
        - generic [ref=e110]:
          - generic [ref=e111]: The Canon
          - heading "Competitive MTG, curated." [level=2] [ref=e112]
          - paragraph [ref=e113]: From Karsten's manabase math to Saito's tournament mindset — 65 curated references organized by skill level. Dead links restored via archive.org.
          - button [ref=e114] [cursor=pointer]
          - generic [ref=e118]: 65 references · 5 curated tracks · Karsten · PVDDR · Saito · Chapin · Budde
      - generic [ref=e119]:
        - generic [ref=e120]:
          - text: Powered By
          - heading "Rigorous Mathematics" [level=2] [ref=e121]
          - paragraph [ref=e122]: Not guesswork. Real math behind every number — so you can trust the advice.
        - generic [ref=e123]:
          - generic [ref=e126]:
            - heading "Castability Models" [level=5] [ref=e127]
            - paragraph [ref=e128]: Per spell
            - paragraph [ref=e129]: Default estimates and explicit exact-model limits
            - generic [ref=e130]: Hypergeometric distribution
          - generic [ref=e134]:
            - heading "Proven Land Targets" [level=5] [ref=e135]
            - paragraph [ref=e136]: 90%
            - paragraph [ref=e137]: How many color sources you need to cast your spells on curve
            - generic [ref=e138]: Frank Karsten tables
          - generic [ref=e142]:
            - heading "Smart Mulligan Advice" [level=5] [ref=e143]
            - paragraph [ref=e144]: Keep / Mull
            - paragraph [ref=e145]: 10,000 hands simulated to find your optimal keep/mull thresholds
            - generic [ref=e146]: Monte Carlo + Bellman
      - generic [ref=e148]:
        - generic [ref=e149]:
          - text: The Intellectual Canon
          - heading "The Competitive Reading Library" [level=2] [ref=e150]
          - paragraph [ref=e151]: Every essential article a Magic player should read, in one place. From Karsten's manabase math to Saito's tournament mindset — five curated tracks across every format, with dead links restored via archive.org.
        - generic [ref=e152]:
          - generic [ref=e157] [cursor=pointer]:
            - generic [ref=e158]:
              - paragraph [aria-hidden] [ref=e159]: 🎴
              - generic [ref=e160]: 5 articles
            - heading "Your First FNM" [level=6] [ref=e161]
            - generic [ref=e162]: Starting out
            - paragraph [ref=e163]: Reid Duke · Karsten · Chapin · Kuisma · Saito — the foundations that win your first round.
          - generic [ref=e168] [cursor=pointer]:
            - generic [ref=e169]:
              - paragraph [aria-hidden] [ref=e170]: 🏆
              - generic [ref=e171]: 7 articles
            - heading "Preparing for an RCQ" [level=6] [ref=e172]
            - generic [ref=e173]: Leveling up
            - paragraph [ref=e174]: PVDDR's 6 Heuristics · Manfield's prep routine · ladder strategy essentials — the curriculum from FNM regular to RCQ competitor.
          - generic [ref=e179] [cursor=pointer]:
            - generic [ref=e180]:
              - paragraph [aria-hidden] [ref=e181]: 🎯
              - generic [ref=e182]: 9 articles
            - heading "Pro Tour Preparation" [level=6] [ref=e183]
            - generic [ref=e184]: Mastering
            - paragraph [ref=e185]: Saito's 6-part mindset series · Dagen · Moudou game theory — the international canon rescued from link rot.
          - generic [ref=e190] [cursor=pointer]:
            - generic [ref=e191]:
              - paragraph [aria-hidden] [ref=e192]: 👑
              - generic [ref=e193]: 5 articles
            - heading "Commander Pod" [level=6] [ref=e194]
            - generic [ref=e195]: Piloting 100 cards
            - paragraph [ref=e196]: Karsten adapted for singleton · Bracket System · Command Zone · Game Knights · EDHREC — the EDH canon 60-card sites ignore.
          - generic [ref=e201] [cursor=pointer]:
            - generic [ref=e202]:
              - paragraph [aria-hidden] [ref=e203]: 📦
              - generic [ref=e204]: 3 articles
            - heading "Limited (Draft & Sealed)" [level=6] [ref=e205]
            - generic [ref=e206]: Cracking packs
            - paragraph [ref=e207]: Limited Resources · 17Lands · LSV — the signals, the curves, and the data-driven coverage that changed how Limited is played.
        - button [ref=e209] [cursor=pointer]
      - generic [ref=e216]:
        - heading "What You Get" [level=2] [ref=e217]
        - generic [ref=e218]:
          - generic [ref=e221]:
            - generic [aria-hidden] [ref=e223]: 
            - generic [ref=e224]:
              - heading "Castability" [level=6] [ref=e229]
              - paragraph [ref=e230]:
                - text: Model-based
                - generic [ref=e231]: cast probability
                - text: . The default estimate includes mana rocks and dorks; exact modes cover only their stated supported model.
          - generic [ref=e234]:
            - generic [aria-hidden] [ref=e236]: 
            - generic [ref=e237]:
              - heading "Analysis Dashboard" [level=6] [ref=e242]
              - paragraph [ref=e243]: Visual breakdown of your spells by category, curve insights, and performance diagnostics at a glance.
          - generic [ref=e246]:
            - generic [aria-hidden] [ref=e248]: 
            - generic [ref=e249]:
              - heading "Mulligan Simulator" [level=6] [ref=e254]
              - paragraph [ref=e255]:
                - generic [ref=e256]: 10,000 simulated hands
                - text: help compare whether to keep or mulligan.
          - generic [ref=e259]:
            - generic [aria-hidden] [ref=e261]: 
            - generic [ref=e262]:
              - generic [ref=e267]:
                - heading "Export Blueprint" [level=6] [ref=e268]
                - generic [ref=e269]: NEW
              - paragraph [ref=e270]: Download your analysis as PNG, PDF or JSON. Share on Discord or archive.
      - generic [ref=e272]:
        - heading "How It Works" [level=2] [ref=e273]
        - generic [ref=e274]:
          - generic [ref=e276]:
            - heading "1" [level=4] [ref=e278]
            - heading "Paste Your Deck" [level=6] [ref=e279]
            - paragraph [ref=e280]: MTGO, MTGA, Moxfield & more
          - generic [ref=e282]:
            - heading "2" [level=4] [ref=e284]
            - heading "Get Probabilities" [level=6] [ref=e285]
            - paragraph [ref=e286]: Cast chances for every spell, every turn
          - generic [ref=e288]:
            - heading "3" [level=4] [ref=e290]
            - heading "Know Your Mulligans" [level=6] [ref=e291]
            - paragraph [ref=e292]: Optimal thresholds for your archetype
      - generic [ref=e293]:
        - paragraph [ref=e297]:
          - strong [ref=e298]: New to manabase theory?
          - text: Learn the math behind optimal deckbuilding
        - button [ref=e299] [cursor=pointer]
      - generic [ref=e303]:
        - paragraph [ref=e304]:
          - generic [aria-hidden] [ref=e305]: 
          - text: Local calculations
        - paragraph [ref=e306]:
          - generic [aria-hidden] [ref=e307]: 
          - text: No account required
        - paragraph [ref=e308]:
          - generic [aria-hidden] [ref=e309]: 
          - text: Auto-saved
      - generic [ref=e310]:
        - generic [ref=e311]:
          - heading "Free & Open Source" [level=6] [ref=e312]
          - text: MIT License
        - generic [ref=e313]:
          - heading "10,000" [level=6] [ref=e314]
          - text: Hands simulated per analysis
        - generic [ref=e315]:
          - heading "5" [level=6] [ref=e316]
          - text: Analysis tabs
        - generic [ref=e317]:
          - heading "No account" [level=6] [ref=e318]
          - text: Required to analyze
      - generic [ref=e319]:
        - generic [aria-hidden] [ref=e321]: 
        - generic [aria-hidden] [ref=e323]: 
        - generic [ref=e324]:
          - heading "Ready to Optimize?" [level=2] [ref=e325]
          - paragraph [ref=e326]: Find out if your manabase can support your game plan
        - button [ref=e327] [cursor=pointer]
  - contentinfo [ref=e331]:
    - generic [ref=e333]:
      - generic [ref=e334]:
        - generic [ref=e335]:
          - paragraph [ref=e336]: Crafted with
          - generic [ref=e337]: ❤️
          - paragraph [ref=e338]: for the MTG community
        - paragraph [ref=e339]: © 2025-2026 ManaTuner. Open source under MIT License.
        - generic [ref=e340]:
          - text: ManaTuner is unofficial Fan Content permitted under the
          - link "Fan Content Policy" [ref=e341] [cursor=pointer]:
            - /url: https://company.wizards.com/en/legal/fancontentpolicy
          - text: . Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
      - generic [ref=e342]:
        - generic [ref=e343]:
          - link "Analyzer" [ref=e344] [cursor=pointer]:
            - /url: /analyzer
          - link "Guide" [ref=e345] [cursor=pointer]:
            - /url: /guide
          - link "Mathematics" [ref=e346] [cursor=pointer]:
            - /url: /mathematics
          - link "Land Glossary" [ref=e347] [cursor=pointer]:
            - /url: /land-glossary
          - link "About" [ref=e348] [cursor=pointer]:
            - /url: /about
          - link "Privacy" [ref=e349] [cursor=pointer]:
            - /url: /privacy
        - generic [ref=e350]:
          - link "Give Feedback" [ref=e351] [cursor=pointer]:
            - /url: https://tally.so/r/A7KRkN
          - separator [ref=e355]
          - link "GitHub" [ref=e356] [cursor=pointer]:
            - /url: https://github.com/gbordes77/manatuner
          - separator [ref=e359]
          - link "Scryfall API" [ref=e360] [cursor=pointer]:
            - /url: https://scryfall.com
          - separator [ref=e361]
          - link "Keyrune Icons" [ref=e362] [cursor=pointer]:
            - /url: https://andrewgioia.github.io/Keyrune/
        - generic [ref=e363]:
          - text: Probability mathematics based on
          - link "Frank Karsten's research" [ref=e364] [cursor=pointer]:
            - /url: https://www.channelfireball.com/articles/how-many-lands-do-you-need-to-consistently-hit-your-land-drops/
```

# Test source

```ts
  1   | /**
  2   |  * Accessibility smoke (EN UI) — WCAG-oriented axe scans + keyboard basics.
  3   |  * Replaces stale FR selectors that broke after the English product copy ship.
  4   |  */
  5   | import { test, expect } from '../../fixtures/audit-browser.js'
  6   | import AxeBuilder from '@axe-core/playwright'
  7   | 
  8   | test.describe('Accessibility smoke (EN)', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     await page.addInitScript(() => {
  11  |       window.localStorage.setItem('manatuner-onboarding-completed', 'true')
  12  |     })
  13  |   })
  14  | 
  15  |   test('Home page — axe critical/serious clear', async ({ page }) => {
  16  |     await page.goto('/')
  17  |     const results = await new AxeBuilder({ page })
  18  |       .withTags(['wcag2a', 'wcag2aa'])
  19  |       .analyze()
  20  |     const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
> 21  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
      |                                                         ^ Error: [
  22  |   })
  23  | 
  24  |   test('Analyzer empty — axe critical/serious clear', async ({ page }) => {
  25  |     await page.goto('/analyzer')
  26  |     await expect(page.getByRole('button', { name: /try example|analyze/i }).first()).toBeVisible({
  27  |       timeout: 15000,
  28  |     })
  29  |     const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  30  |     const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  31  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  32  |   })
  33  | 
  34  |   test('Analyzer after Try Example — no critical/serious axe', async ({ page }) => {
  35  |     test.setTimeout(90000)
  36  |     await page.goto('/analyzer')
  37  |     await page.getByRole('button', { name: /try example/i }).click()
  38  |     await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
  39  |     await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 60000 })
  40  | 
  41  |     const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  42  |     const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious')
  43  |     expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
  44  |   })
  45  | 
  46  |   test('Analyzer navigation is unique in the active desktop or mobile menu', async ({ page }) => {
  47  |     await page.goto('/')
  48  |     const menu = page.getByRole('button', { name: 'Open navigation menu' })
  49  |     await expect(menu.or(page.getByRole('banner').getByRole('link', { name: 'Analyzer', exact: true }))).toBeVisible()
  50  |     const mobile = await menu.isVisible()
  51  |     if (mobile) await menu.click()
  52  |     const bannerAnalyzer = mobile
  53  |       ? page.getByRole('button', { name: 'Analyzer', exact: true })
  54  |       : page.getByRole('banner').getByRole('link', { name: /^Analyzer$/i })
  55  |     await expect(bannerAnalyzer).toHaveCount(1)
  56  |     await bannerAnalyzer.click()
  57  |     await expect(page).toHaveURL(/\/analyzer/)
  58  |   })
  59  | 
  60  |   test('Keyboard: tab reaches primary actions on home', async ({ page }) => {
  61  |     await page.goto('/')
  62  |     await page.keyboard.press('Tab')
  63  |     // After a few tabs something focusable should be active
  64  |     for (let i = 0; i < 8; i++) {
  65  |       await page.keyboard.press('Tab')
  66  |     }
  67  |     const tag = await page.evaluate(() => document.activeElement?.tagName ?? '')
  68  |     expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(tag)
  69  |   })
  70  | 
  71  |   test('Footer contrast text is readable (grey.800 / grey.300)', async ({ page }) => {
  72  |     await page.goto('/')
  73  |     const footer = page.locator('footer')
  74  |     await expect(footer).toBeVisible()
  75  |     await expect(footer.getByText(/Fan Content Policy/i)).toBeVisible()
  76  |     const results = await new AxeBuilder({ page }).include('footer').withRules(['color-contrast']).analyze()
  77  |     expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  78  |   })
  79  | 
  80  |   test('Home hero shows product preview (P2-2)', async ({ page }) => {
  81  |     await page.goto('/')
  82  |     await expect(page.getByTestId('hero-product-preview')).toBeVisible()
  83  |     await expect(page.getByTestId('hero-product-preview')).toContainText(/Health Score/i)
  84  |   })
  85  | 
  86  |   test('Analyzer primary buttons use text + icons (no emoji-only)', async ({ page }) => {
  87  |     await page.goto('/analyzer')
  88  |     const tryExample = page.getByRole('button', { name: /try example/i })
  89  |     await expect(tryExample).toBeVisible({ timeout: 15000 })
  90  |     const label = (await tryExample.innerText()).replace(/\s+/g, ' ').trim()
  91  |     expect(label).toMatch(/Try Example/i)
  92  |     // Emoji-only would be short / symbol-heavy; require latin letters
  93  |     expect(label).toMatch(/[A-Za-z]{3,}/)
  94  |   })
  95  | 
  96  |   test('After analyze, focus lands on Health Score verdict (P2-11)', async ({ page }) => {
  97  |     test.setTimeout(90000)
  98  |     await page.goto('/analyzer')
  99  |     await page.getByRole('button', { name: /try example/i }).click()
  100 |     await page.getByRole('button', { name: /analyze manabase|analyze/i }).first().click()
  101 |     await expect(page.getByTestId('quick-verdict')).toBeVisible({ timeout: 60000 })
  102 |     // Focus should move to verdict region for keyboard users
  103 |     await expect
  104 |       .poll(async () => page.evaluate(() => document.activeElement?.id || ''), { timeout: 5000 })
  105 |       .toBe('quick-verdict')
  106 |     await expect(page.getByTestId('quick-verdict')).toHaveAttribute('aria-live', 'polite')
  107 |   })
  108 | })
  109 | 
```