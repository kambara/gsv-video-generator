# Google StreetView Video Generator

## Install

Install the follwing packages.

- Ruby
- ffmpeg
- x264

If you use [Homebrew](http://mxcl.github.io/homebrew/) on Mac OSX, you can install ffmpeg and x264 by the follwing command:

    $ brew install ffmpeg x264

Then, install gsv-video-generator and required libraries.

    $ git clone git@github.com:kambara/gsv-video-generator.git
    $ cd gsv-video-generator
    $ gem install bundler   ## OR $ sudo gem install bundler
    $ bundle install   ## OR $ sudo bundle install

If you use [rbenv](https://github.com/sstephenson/rbenv), install them like this:

    $ rbenv install 2.0.0-p195
    $ rbenv rehash
    $ git clone git@github.com:kambara/gsv-video-generator.git
    $ cd gsv-video-generator
    $ rbenv local 2.0.0-p195
    $ gem install bundler
    $ rbenv rehash
    $ bundle install

## Usage

Start the application server.

    $ cd gsv-video-generator
    $ ruby app.rb

Open [http://localhost:3000/](http://localhost:3000/) in your web browser (Google Chrome is recommended).

After specifying a start point (A) and a goal point (B), press the 'Generate' button.