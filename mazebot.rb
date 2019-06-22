#
# Ruby automated mazebot racer example
#
# Can you write a program that finishes the race?
#
require "net/http"
require "json"

def main
  # get started — replace with your login
  start = post_json('/mazebot/race/start', { :login => 'mazebot' })

  maze_path = start['nextMaze']
  # get the first maze
  next_maze = get_json(maze_path)
  # Answer each question, as long as we are correct
  loop do

    # print out the map
    puts
    puts "Here's the map:"
    puts
    next_maze['map'].each { |row| puts(row.join('')) }
    puts

    puts "What are the directions from point A to point B?"

    # your code to figure out the answer could also go here
    directions = gets.delete("\n")

    # send to mazebot
    solution_result = send_solution(maze_path, directions)
    if solution_result['result'] == 'success'
      maze_path = solution_result['nextMaze']
      next_maze = get_json(maze_path)
    end
  end
end

def send_solution(path, directions)
  post_json(path, { :directions => directions })
end

# get data from the api and parse it into a ruby hash
def get_json(path)
  puts "*** GET #{path}"

  response = Net::HTTP.get_response(build_uri(path))
  result = JSON.parse(response.body)
  puts "HTTP #{response.code}"

  #puts JSON.pretty_generate(result)
  result
end

# post an answer to the noops api
def post_json(path, body)
  uri = build_uri(path)
  puts "*** POST #{path}"
  puts JSON.pretty_generate(body)

  post_request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
  post_request.body = JSON.generate(body)

  response = Net::HTTP.start(uri.hostname, uri.port, :use_ssl => true) do |http|
    http.request(post_request)
  end

  puts "HTTP #{response.code}"
  result = JSON.parse(response.body)
  puts result[:result]
  result
end

def build_uri(path)
  URI.parse("https://api.noopschallenge.com" + path)
end

main()
