class DashboardController < ApplicationController
  def index
  end

  def chart_data
    temperatures = Rails.cache.fetch("temperatures", expires_in: 3.seconds) do
      fetch_remote_data
    end

    respond_to do |format|
      format.json do
        render json: temperatures, status: :ok
      end
    end
  end

  private def fetch_remote_data
    data_object = JSON([
      {
        name: "Alpha",
        temperature: (87.0 + rand(-10.0..10.0))
      },
      {
        name: "Beta",
        temperature: (74.0 + rand(-10.0..10.0))
      },
      {
        name: "Gamma",
        temperature: (84.0  + rand(-10.0..10.0))
      },
      {
        name: "Delta",
        temperature: (95.0  + rand(-10.0..10.0))
      },
      {
        name: "Epsilon",
        temperature: (60.0  + rand(-10.0..10.0))
      }
    ]) # String
    return data_object
  end
end
