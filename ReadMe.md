## About
---
IconBrowser is used to browse icon fonts and provide and easy interface to search for one or more icons by part/all of icon name.


## Usage
---
Just open [Home page](https://muh00mad.github.io/icon-browser/) and follow the instruction.

## How it works
---
the main components of the project are render.js, index.html and lib directory where:

render.js: loads all modules from lib directory and render it to index.html, also contains search function
index.html: user interface to navigate loaded modules
lib: contains all modules to be loaded.

the sequence of execution is
  1. load lib/config.json which contains all package basic information.
  2. for each package get icon map files 'will be explained later'.
  3. load all common css files.
  3. for each package load its css files.
  4. after all packages are loaded with their icon maps execute custom event.
  5. a custom event handler is executed and render all packages and their icons.

the directory lib/common/css/ is used to store all common css used by all packages and loaded at step 3.

the basic config.json looks like:
```
{
    "CommonCss": [],

    "Packages":
    [
        {
            "Name": "",
            "Version": "",
            "URL": "",
            "Location": "",
            "IconMaps": [],
            "Css": []
        }
    ]
}
```

the `CommonCss` array contains css file names that will be loaded from lib/common/css directory.

the `Packages` array contains list of objects that define packages to be loaded where:

`Name` is package name, `Version` is package version, `URL` package developer and where the license can be obtained.

`Location` is relative path of the package from `lib/` directory, the path must end with `/` otherwise it will not be found.

`IconMaps` is a path to one or more json file that contains a map for css-rule-name to text, the path is relative to package `Location`.

`Css` is a path to one or more css file for the package, the path is relative to package `Location`.

the json file for icon maps is simple:
```
{
    "Prefix": "",
    "Icons":
    [
		{
			"Title":"",
			"Css":""
		}
    ]
}
```

the `Prefix` is a css rule-name to set as a prefix to the icon css.

the `Icons` array contains one or more icon definition where each icon have `Css` which is css-rule for icon and `Title` which is icon title, for now the icon title is used as tags, i.e. it get split using whitespace, dash and underscore.
