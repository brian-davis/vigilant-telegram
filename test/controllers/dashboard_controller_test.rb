require "test_helper"

class DashboardControllerTest < ActionDispatch::IntegrationTest
  test "should get chart" do
    get dashboard_chart_url
    assert_response :success
  end

  test "should get chart_data" do
    get dashboard_chart_data_url
    assert_response :success
  end
end
