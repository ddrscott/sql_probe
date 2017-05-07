class NaughtyController < ApplicationController
  def unbound_sql
    10.times do |i|
      25.times do |j|
        Home.where("address like '#{j}%'").to_a
      end
    end
    render text: 'done'
  end
end
