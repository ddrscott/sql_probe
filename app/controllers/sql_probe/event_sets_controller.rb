module SqlProbe
  # Manage an Event File
  class EventSetsController < SqlProbe::ApplicationController
    # @return all event sets
    def index
      render json: EventSet.all
    end

    # @return a single event set
    def show
      render json: EventSet[params[:id]]
    end

    # @return a single event from an event set
    def event
      render json: params_event
    end

    # @return explain plan of a event's query
    def explain
      ensure_rollback do
        render json: ActiveRecord::Base.connection.explain(params_event['sql'], sql_binds)
      end
    end

    # @return results of event's query
    def execute
      ensure_rollback do
        render json: ActiveRecord::Base.connection.exec_query(params_event['sql'], 'SQL', sql_binds)
      end
    end

    private

    def ensure_rollback
      ActiveRecord::Base.transaction do
        yield
        raise ActiveRecord::Rollback
      end
    end

    def sql_binds
      params_event['binds'].map { |bind| OpenStruct.new(bind.symbolize_keys) }
    end

    def params_event
      @params_event ||= EventSet[params[:id]]['events'][params_event_id]
    end

    def params_event_id
      params[:event_id].to_i
    end
  end
end
