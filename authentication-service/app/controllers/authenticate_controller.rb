# frozen_string_literal: true
require 'jwt'

class AuthenticateController < ApplicationController
  def create
    result = get_result(params)

    json_response({message: result}, result[:status])
  end

  def get_result(params)
    login = params[:values][:"userName"]
    password = params[:values][:"password"]
    response = authenticate(login, password)

    handle_response_status(response.status)
  end

  def handle_response_status(status)
    if status == 200
      return {status: 200, token: generate_jwt_token}
    end

    {status: 401}
  end

  def generate_jwt_token
    payload = {data: 'test'}
    rsa_private = OpenSSL::PKey::RSA.generate 2048
    rsa_public = rsa_private.public_key

    JWT.encode payload, rsa_private, 'RS256'
  end

  def authenticate(login, password)
    data = {:sf_username => login, :sf_password => password}
    conn = Faraday.new(url: Settings.spotfire_server)

    conn.post do |req|
      req.url '/spotfire/sf_security_check'
      req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      req.headers['X-Requested-With'] = 'XMLHttpRequest'
      req.headers['Referer'] = "#{Settings.spotfire_server}/spotfire/login.html"
      req.body = URI.encode_www_form(data)
    end
  end
end