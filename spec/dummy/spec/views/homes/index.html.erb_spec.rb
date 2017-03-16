require 'rails_helper'

RSpec.describe "homes/index", type: :view do
  before(:each) do
    assign(:homes, [
      Home.create!(
        :address => "Address"
      ),
      Home.create!(
        :address => "Address"
      )
    ])
  end

  it "renders a list of homes" do
    render
    assert_select "tr>td", :text => "Address".to_s, :count => 2
  end
end
