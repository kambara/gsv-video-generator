require 'base64'
require 'fileutils'
require 'bundler'
Bundler.require

set :port, 3000

get '/' do
  slim :index
end

get "/css/application.css" do
  sass :application
end

post '/save' do
  FileUtils.mkdir_p('data')
  filename = "%08d.jpg"%params[:index]
  File.open("data/#{filename}", 'wb') do |f|
    f.write Base64.decode64(params[:image])
  end
end

post '/finish' do
  system 'mencoder "mf://data/*.jpg" -mf fps=30 -ovc x264 -o video.mp4'
end
