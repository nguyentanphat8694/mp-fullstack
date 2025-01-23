import { useState, useEffect } from "react"
import { Pencil, Check, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import useUserInfoStore from "@/stores/useUserInfoStore"

export const ContractNotes = ({ contractId, readOnly = false }) => {
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingNote, setEditingNote] = useState(null)
  const [newNote, setNewNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const userInfo = useUserInfoStore((state) => state.userInfo)
  const isAccountant = userInfo?.role === 'accountant'

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}/notes`)
        const data = await response.json()
        setNotes(data)
      } catch (error) {
        console.error('Error fetching notes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (contractId) {
      fetchNotes()
    }
  }, [contractId])

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/contracts/${contractId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content: newNote })
      })
      const data = await response.json()
      setNotes([...notes, data])
      setNewNote("")
    } catch (error) {
      console.error('Error adding note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateNote = async (noteId, content) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/contracts/${contractId}/notes/${noteId}`, {
        method: 'PUT',
        body: JSON.stringify({ content })
      })
      const data = await response.json()
      setNotes(notes.map(note => 
        note.id === noteId ? data : note
      ))
      setEditingNote(null)
    } catch (error) {
      console.error('Error updating note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApproveNote = async (noteId) => {
    try {
      setIsSubmitting(true)
      const response = await fetch(`/api/contracts/${contractId}/notes/${noteId}/approve`, {
        method: 'POST'
      })
      const data = await response.json()
      setNotes(notes.map(note => 
        note.id === noteId ? data : note
      ))
    } catch (error) {
      console.error('Error approving note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="space-y-2">
          <Textarea
            placeholder="Thêm ghi chú mới..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button
            onClick={handleAddNote}
            disabled={isSubmitting || !newNote.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm ghi chú
          </Button>
        </div>
      )}

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 border rounded-lg space-y-2"
            >
              {editingNote === note.id ? (
                <div className="space-y-2">
                  <Textarea
                    defaultValue={note.content}
                    onChange={(e) => setEditingNote({
                      ...editingNote,
                      content: e.target.value
                    })}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateNote(note.id, editingNote.content)}
                      disabled={isSubmitting}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Lưu
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingNote(null)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {note.created_by_name} - {format(new Date(note.created_at), 'HH:mm dd/MM/yyyy', { locale: vi })}
                      </p>
                      <p className="mt-1">{note.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!readOnly && note.status === 'pending' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingNote(note)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {isAccountant && note.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleApproveNote(note.id)}
                          disabled={isSubmitting}
                        >
                          Xác nhận
                        </Button>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={note.status === 'approved' ? 'success' : 'secondary'}
                  >
                    {note.status === 'approved' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                  </Badge>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
} 