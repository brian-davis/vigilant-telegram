Rails.application.routes.draw do
  get 'dashboard/chart', as: :chart
  get 'dashboard/chart_data', as: :chart_data, defaults: { format: :json }

  root "dashboard#chart"
end
