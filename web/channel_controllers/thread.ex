defmodule Agora.ChannelController.Thread do
  use Agora.Web, :channel_controller

  require Logger

  def handle_action("add", thread_params, socket) do
    changeset = Thread.changeset(%Thread{}, put_info(thread_params, socket))
    true = validate_info(changeset, socket)

    case Repo.insert(changeset) do
      {:ok, thread} ->
        group_id = thread.parent_group_id
        if group_id != nil do
          query = from t in Agora.Thread,
            where: t.parent_group_id == ^group_id,
            order_by: [desc: t.inserted_at],
            select: t.id
          threads = Repo.all(query)
          broadcast_to_group(group_id, "add threads", %{
            threads: threads
          })
        end
        {:ok, %{"id" => thread.id}, socket}
      {:error, changeset} ->
        Logger.debug "#{inspect changeset}"
        {:error, socket} # TODO return error message
    end
  end

  def handle_action("fetch", ids, socket) do
    posts_query = Agora.Post
                  |> select([p], p.id)
    query = Agora.Thread
            |> where([t], t.id in ^ids)
            |> select([t], t)
            |> preload([posts: ^posts_query])
    func = fn t ->
      t
      |> Map.update!(:posts, fn ids -> length(ids) end)
      |> (fn t -> {Integer.to_string(t.id), t} end).()
    end
    threads = Repo.all(query)
              |> Enum.map(func)
              |> Enum.into(%{})
    {:ok, %{threads: threads}, socket}
  end

  def handle_action("fetch all threads", _params, socket) do
    query = from t in Thread,
      select: t.id,
      order_by: [desc: t.updated_at],
      limit: 100
    threads = Repo.all(query)
    {:ok, %{threads: threads}, socket}
  end

  def handle_action("get by account", _, socket) do
    account_id = socket.assigns.account.id
    query = from t in Thread,
      where: t.account_id == ^account_id,
      select: t.id,
      order_by: [desc: t.updated_at],
      limit: 100
    threads = Repo.all(query)
    {:ok, %{threads: threads}, socket}
  end

  def handle_action("get by group", id, socket) do
    id = String.to_integer id
    query = from t in Agora.Thread,
      where: t.parent_group_id == ^id,
      select: t.id,
      order_by: [desc: t.inserted_at],
      limit: 100
    threads = Repo.all(query)
    {:ok, %{threads: threads}, socket}
  end
end
