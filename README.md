# Google StreetView Video Generator

## Install

Install the follwing packages.

- Ruby (>= verion 1.9)
- ffmpeg
- x264

If you use Homebrew on Mac OSX, you can install ffmpeg and x264 by the follwing command:

    $ brew install ffmpeg x264

Then, install gsv-video-generator and required libraries.

    $ git clone git@github.com:kambara/gsv-video-generator.git
    $ cd gsv-video-generator
    $ gem install bundler   ## OR  $ sudo gem install bundler
    $ bundle install

## Start the application server

    $ ruby app.rb

Open [http://localhost:3000/](http://localhost:3000/) in a web browser (Google Chrome is recommended).
