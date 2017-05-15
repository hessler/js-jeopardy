# JavaScript Jeopardy
A simple and customizable JavaScript-based Jeopardy game. Please note that this is **_not_** any sort of multi-player game, nor does it have any sort of logic for keeping track of points/money. Rather, it is a simple display of a Jeopardy game with an intro screen, a Jeopardy board with categories/questions, and an end-of-game screen.

## Instructions
To instantiate a new Jeopardy game, create a new Jeopardy variable, passing in an object of customizable options, if desired:

```
var jeopardy = new Jeopardy(options);
```

The game will automatically initialize and build itself out, appending all necessary DOM elements to the document body of your web page. 

## Requirements
The game requires jQuery, which you will need to link to in your HTML.:  
```
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
```

## Customization
The following are the options that can be passed in to the new Jeopardy instance:

**currency** _(String)_:  
The currency to use for question values. If not set, the currency will default to '$'.

**messages** _(Object)_:
An object with String values for any/all of the following key attributes:
- `orientation` _(Default: 'Please rotate your device or resize your screen so the browser window is in landscape orientation.')_
- `welcome` _(Default: 'Welcome to Jeopardy!')_
- `game_over` _(Default: 'Thanks for playing!')_

**questions** _(Array)_:  
An array of objects, each of which represents one of the game's categories. Each object must have attributes for `category` _(the name of the category)_ and `questions` _(an array of question objects with attributes for `value`, `question`, and `answer`)_.  
```
[
    {
        'category': 'Category Name One',
        'questions': [
            {
                'value': '100',
                'question': 'Sample question text.',
                'answer': 'Sample question answer.'
            },
            ...
            {
                'value': '500',
                'question': 'Sample question text.',
                'answer': 'Sample question answer.'
            }
        ]
    }
    ...
    {
        'category': 'Category Name Six',
        'questions': [
            {
                'value': '100',
                'question': 'Sample question text.',
                'answer': 'Sample question answer.'
            },
            ...
            {
                'value': '500',
                'question': 'Sample question text.',
                'answer': 'Sample question answer.'
            }
        ]
    }
]
```

**finalJeopardy** _(Object)_  
An object with attributes and values for the Final Jeopardy.  
```
{
    'category': 'Sample Category',
    'question': 'Sample question text.',
    'answer': 'Sample question answer.'
}
```
