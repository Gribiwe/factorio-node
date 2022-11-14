local function print(x)
    local text = game.table_to_json(x):gsub("\"prerequisites\":{}", "\"prerequisites\":[]")
    rcon.print(text)
end

local getResourcesStat = function()
    local resources = {}

    local result = { fiveSecondResourcesIn = {}, oneMinuteResourcesIn = {}, tenMinutesResourcesIn = {}, oneHourResourcesIn = {}, tenHourResourcesIn = {}, tenHourResourcesOut = {}, fiftyHourResourcesIn = {}, twoHundredFiftyHourResourcesIn = {}, thousandHourResourcesIn = {}, fiveSecondResourcesOut = {}, oneMinuteResourcesOut = {}, tenMinutesResourcesOut = {}, oneHourResourcesOut = {}, fiftyHourResourcesOut = {}, twoHundredFiftyHourResourcesOut = {}, thousandHourResourcesOut = {} }
    for resource, i in pairs(game.item_prototypes) do
        local amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = true, precision_index = 0, count = false }))
        if amount ~= 0 then
            table.insert(result.fiveSecondResourcesIn, { resource = resource, amount = amount })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = false, precision_index = 0, count = false }))
        if amount ~= 0 then
            table.insert(result.fiveSecondResourcesOut, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = true, precision_index = 1, count = false }))
        if amount ~= 0 then
            table.insert(result.oneMinuteResourcesIn, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = false, precision_index = 1, count = false }))
        if amount ~= 0 then
            table.insert(result.oneMinuteResourcesOut, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = true, precision_index = 2, count = false }))
        if amount ~= 0 then
            table.insert(result.tenMinutesResourcesIn, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = false, precision_index = 2, count = false }))
        if amount ~= 0 then
            table.insert(result.tenMinutesResourcesOut, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = true, precision_index = 3, count = false }))
        if amount ~= 0 then
            table.insert(result.oneHourResourcesIn, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = false, precision_index = 3, count = false }))
        if amount ~= 0 then
            table.insert(result.oneHourResourcesOut, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = true, precision_index = 4, count = false }))
        if amount ~= 0 then
            table.insert(result.tenHourResourcesIn, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = false, precision_index = 4, count = false }))
        if amount ~= 0 then
            table.insert(result.tenHourResourcesOut, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = true, precision_index = 5, count = false }))
        if amount ~= 0 then
            table.insert(result.fiftyHourResourcesIn, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = false, precision_index = 5, count = false }))
        if amount ~= 0 then
            table.insert(result.fiftyHourResourcesOut, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = true, precision_index = 6, count = false }))
        if amount ~= 0 then
            table.insert(result.twoHundredFiftyHourResourcesIn, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = false, precision_index = 6, count = false }))
        if amount ~= 0 then
            table.insert(result.twoHundredFiftyHourResourcesOut, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = true, precision_index = 7, count = false }))
        if amount ~= 0 then
            table.insert(result.thousandHourResourcesIn, { resource = resource, amount = string.format("%.1f",amount) })
        end

        amount = tonumber(string.format("%.1f", game.forces["player"].item_production_statistics.get_flow_count { name = resource, input = false, precision_index = 7, count = false }))
        if amount ~= 0 then
            table.insert(result.thousandHourResourcesOut, { resource = resource, amount = string.format("%.1f",amount) })
        end
    end
    return result
end

local startResearch = function(research)
    game.forces["player"].add_research(research)
end

local formatResearch = function(tech, index)
    local scienceList = {}
    for j, science in pairs(tech.research_unit_ingredients) do
        table.insert(scienceList, science.name)
    end

    local prerequisites = {};
    for name, preTech in pairs(tech.prerequisites) do
        table.insert(prerequisites, name)
    end

    return {index = index, prerequisites = prerequisites, alias = tech.name, researched = tech.researched, level = tech.level, researchUnitCount = tech.research_unit_count, scienceList = scienceList}
end

local getResearches = function(researches)
    local result = {}
    local index = 0
    for i, tech in pairs(researches) do
        table.insert(result, formatResearch(tech, index))
        index=index+1
    end
    return result
end

local removeResearch = function(researchName)
    local queue =  game.forces["player"].research_queue
    game.forces["player"].cancel_current_research()
    game.forces["player"].cancel_current_research()
    game.forces["player"].cancel_current_research()
    game.forces["player"].cancel_current_research()
    game.forces["player"].cancel_current_research()
    game.forces["player"].cancel_current_research()
    game.forces["player"].cancel_current_research()

    for i = 1, #queue do
        if queue[i].name ~= researchName then
            game.forces["player"].add_research(queue[i])
        end
    end
end

local getResearchesInfo = function()
    local technologies = getResearches(game.forces["player"].technologies)
    local queue = getResearches(game.forces["player"].research_queue)
    if not next(queue) then
        queue = nil
    end

    local progress = string.format("%.0f",game.forces["player"].research_progress*100)

    return {technologies = technologies, queue = queue, progress = progress}
end

commands.add_command("getResourcesInfo", nil, function()
    print({resourcesStat = getResourcesStat()})
end)

commands.add_command("getResearchesInfo", nil, function()
    print({researchesInfo = getResearchesInfo()})
end)

commands.add_command("startResearch", nil, function(command)
    local parameter = game.json_to_table(command.parameter);
        startResearch(parameter.technology)
end)

commands.add_command("removeResearch", nil, function(command)
    local parameter = game.json_to_table(command.parameter);
    removeResearch(parameter.technology)
end)