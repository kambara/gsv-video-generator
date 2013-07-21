require 'rubygems'
require 'bundler'
Bundler.require
require 'base64'
require 'fileutils'

set :port, 3000

get '/' do
  slim :index
end

get "/css/application.css" do
  sass :application
end

post '/start' do
  FileUtils.rm_rf('data')
end

post '/save' do
  FileUtils.mkdir_p('data')
  filename = "%08d.jpg"%params[:index]
  File.open("data/#{filename}", 'wb') do |f|
    f.write Base64.decode64(params[:image])
  end
end

post '/finish' do
  FileUtils.mkdir_p('video')
  system 'ffmpeg -i data/%08d.jpg -y -r 30 -f mp4 video/video.mp4'
end

get '/video' do
  send_file 'video/video.mp4'
end

get '/download' do
  content_type 'video/mp4'
  send_file 'video/video.mp4', :disposition => :attachment
end
